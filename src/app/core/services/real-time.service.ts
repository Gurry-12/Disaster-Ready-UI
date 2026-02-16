import { Injectable, inject } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { NotificationService } from './notification.service';
import { Incident, IncidentSeverity, IncidentStatus, IncidentType, SyncStatus } from '../../store/models/incident.model';

@Injectable({
    providedIn: 'root'
})
export class RealTimeService {
    private notificationService = inject(NotificationService);

    // Simulating a WebSocket stream of incident updates
    private incidentUpdates$ = new Subject<Incident>();

    // Use a timer to simulate incoming events from a backend
    constructor() {
        this.startSimulation();
        this.startAlertSimulation();
        // Immediate mock alert for demo verification
        setTimeout(() => {
            this.notificationService.info('System Online: Monitoring Active Channels');
        }, 2000);
    }

    getIncidentUpdates(): Observable<Incident> {
        return this.incidentUpdates$.asObservable();
    }

    // Simulation logic - in a real app, this would be replaced by Socket.io or SignalR
    private startSimulation() {
        interval(15000).subscribe(() => { // Every 15 seconds
            const randomIncident = this.generateRandomIncident();

            this.incidentUpdates$.next(randomIncident);
        });
    }

    private startAlertSimulation() {
        // Different timer for generic system alerts
        interval(25000).subscribe(() => {
            const r = Math.random();
            if (r > 0.7) {
                this.notificationService.info(`Weather Update: ${this.getRandomWeatherEvent()}`);
            } else if (r > 0.4) {
                this.notificationService.success('System Sync Completed: Data up to date.');
            } else if (r > 0.1) {
                this.notificationService.warning(`Resource Alert: ${this.getRandomResourceAlert()}`);
            } else {
                this.notificationService.error('Connection unstable: Retrying sensor link...');
            }
        });
    }

    private getRandomWeatherEvent(): string {
        const events = [
            'Heavy rainfall expected in coastal areas.',
            'Heatwave warning issued for northern region.',
            'Wind speeds reaching 50km/h in downtown.',
            'Clear skies projected for next 24 hours.'
        ];
        return events[Math.floor(Math.random() * events.length)];
    }

    private getRandomResourceAlert(): string {
        const alerts = [
            'Water supplies running low in Zone A.',
            'Medical kits dispatched to Critical Incident.',
            'Generator fuel levels at 15%.',
            'Vehicle #42 requesting maintenance.'
        ];
        return alerts[Math.floor(Math.random() * alerts.length)];
    }

    private generateRandomIncident(): Incident {
        const types = [IncidentType.FLOOD, IncidentType.FIRE, IncidentType.EARTHQUAKE, IncidentType.CYCLONE, IncidentType.EPIDEMIC];
        const severities = [IncidentSeverity.LOW, IncidentSeverity.MEDIUM, IncidentSeverity.HIGH, IncidentSeverity.CRITICAL];
        const statuses = [IncidentStatus.REPORTED, IncidentStatus.IN_PROGRESS, IncidentStatus.RESOLVED];

        const severity = severities[Math.floor(Math.random() * severities.length)];

        // Trigger high priority alert for critical incidents
        if (severity === IncidentSeverity.CRITICAL) {
            // We can optionally trigger a separate prompt notification here if needed, 
            // but Dashboard handles the aggregate count.
        }

        return {
            id: crypto.randomUUID(),
            type: types[Math.floor(Math.random() * types.length)],
            severity: severity,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            title: `Real-time ${severity} Alert`,
            description: 'Sensor network detected anomalous readings indicating potential disaster event.',
            location: {
                latitude: 20 + Math.random() * 10,
                longitude: 78 + Math.random() * 10,
                address: 'Simulated Location Sector ' + Math.floor(Math.random() * 100),
                city: 'Simulated City',
                state: 'Simulated State',
                accuracy: 10
            },
            reportedBy: 'System Sensor Array',
            reportedAt: Date.now(),
            updatedAt: Date.now(),
            tags: ['live', 'sensor-data', 'automated'],
            priority: Math.floor(Math.random() * 5) + 1,
            assignedResources: [],
            syncStatus: SyncStatus.SYNCED,
            localId: crypto.randomUUID()
        };
    }
}
