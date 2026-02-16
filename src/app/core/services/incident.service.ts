import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Incident, CreateIncidentDto, UpdateIncidentDto, SyncStatus, IncidentStatus, IncidentType, IncidentSeverity } from '../../store/models/incident.model';
import { OfflineStorageService } from './offline-storage.service';
import { NetworkService } from './network.service';
import { environment } from '../../../environments/environment';

import { LoggerService } from '../../shared/services/logger.service';

@Injectable({
    providedIn: 'root'
})
export class IncidentService {
    private apiUrl = `${environment.apiUrl}${environment.endpoints.incidents}`;
    private mockUrl = '/assets/data/mock-incidents.json'; // Use leading slash

    constructor(
        private http: HttpClient,
        private offlineService: OfflineStorageService,
        private networkService: NetworkService,
        private logger: LoggerService
    ) { }

    /**
     * Get all incidents
     * Strategy: If online, fetch from API and update cache. If offline or API fails, return from cache.
     */
    getIncidents(): Observable<Incident[]> {

        if (!environment.production) {

            // Development Mode: Use Mock Data
            return this.http.get<any[]>(this.mockUrl).pipe(
                map(data => data as Incident[]),
                tap(incidents => this.offlineService.saveIncidents(incidents))
            );
        }

        return this.networkService.isOnline$.pipe(
            switchMap(isOnline => {
                if (isOnline) {
                    return this.http.get<Incident[]>(this.apiUrl).pipe(
                        tap(incidents => {
                            // Cache to offline storage
                            this.offlineService.saveIncidents(incidents);
                        }),
                        catchError(error => {
                            this.logger.error('API Error, falling back to offline storage', error);
                            // Fallback to offline if API fails
                            return from(this.offlineService.getIncidents());
                        })
                    );
                } else {
                    return from(this.offlineService.getIncidents());
                }
            })
        );
    }

    /**
     * Get single incident
     */
    getIncident(id: string): Observable<Incident | undefined> {
        return this.networkService.isOnline$.pipe(
            switchMap(isOnline => {
                if (isOnline) {
                    return this.http.get<Incident>(`${this.apiUrl}/${id}`).pipe(
                        tap(incident => {
                            this.offlineService.saveIncident(incident);
                        }),
                        catchError(() => {
                            return from(this.offlineService.getIncident(id));
                        })
                    );
                } else {
                    return from(this.offlineService.getIncident(id));
                }
            })
        );
    }

    /**
     * Create incident
     * Strategy: Optimistic update. Save to local DB always. Try API if online.
     * If offline or API fails, queue for sync.
     */
    createIncident(incidentDto: CreateIncidentDto): Observable<Incident> {
        const tempId = crypto.randomUUID();
        const timestamp = Date.now();

        const newIncident: Incident = {
            ...incidentDto,
            id: tempId,
            status: IncidentStatus.REPORTED,
            reportedAt: timestamp,
            updatedAt: timestamp,
            assignedResources: [],
            syncStatus: SyncStatus.PENDING,
            reportedBy: 'current-user', // Should be from Auth service
            priority: this.calculatePriority(incidentDto.severity),
            tags: incidentDto.tags || []
        };

        if (!environment.production) {

            return this.saveOffline(newIncident, 'CREATE_INCIDENT', incidentDto);
        }

        return this.networkService.isOnline$.pipe(
            switchMap(isOnline => {
                if (isOnline) {
                    return this.http.post<Incident>(this.apiUrl, incidentDto).pipe(
                        tap(savedIncident => {
                            // Replace temp incident with real one or update it
                            this.offlineService.saveIncident({ ...savedIncident, syncStatus: SyncStatus.SYNCED });
                        }),
                        catchError(error => {
                            this.logger.error('Create failed, saving locally', error);
                            return this.saveOffline(newIncident, 'CREATE_INCIDENT', incidentDto);
                        })
                    );
                } else {
                    return this.saveOffline(newIncident, 'CREATE_INCIDENT', incidentDto);
                }
            })
        );
    }

    private saveOffline(incident: Incident, actionType: string, payload: any): Observable<Incident> {
        this.offlineService.saveIncident(incident);
        this.offlineService.addToSyncQueue({ type: actionType, payload, tempId: incident.id });
        return of(incident);
    }

    private calculatePriority(severity: IncidentSeverity): number {
        switch (severity) {
            case IncidentSeverity.CRITICAL: return 5;
            case IncidentSeverity.HIGH: return 4;
            case IncidentSeverity.MEDIUM: return 3;
            case IncidentSeverity.LOW: return 2;
            default: return 1;
        }
    }

    // Update methods would follow similar pattern...
}
