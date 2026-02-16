import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Resource, ResourceSearchFilters, ResourceStatus, UpdateResourceStatusDto } from '../../store/models/resource.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {
    private http = inject(HttpClient);
    private resourcesUrl = '/assets/data/mock-resources.json'; // Use local mock for now

    // In-memory cache for demo purposes since we don't have a real backend yet
    private resourcesCache = new BehaviorSubject<Resource[]>([]);
    private initialized = false;

    getResources(filters?: ResourceSearchFilters): Observable<Resource[]> {
        if (!this.initialized) {
            // Initial load from mock file
            return this.http.get<any[]>(this.resourcesUrl).pipe(
                map(raw => raw.map(r => ({
                    ...r,
                    // Ensure enums match
                    status: r.status as ResourceStatus
                })) as Resource[]),
                tap(resources => {
                    this.resourcesCache.next(resources);
                    this.initialized = true;
                }),
                map(resources => this.applyFilters(resources, filters))
            );
        } else {
            // Return from cache
            return this.resourcesCache.asObservable().pipe(
                map(resources => this.applyFilters(resources, filters))
            );
        }
    }

    getResourceById(id: string): Observable<Resource | undefined> {
        return this.resourcesCache.asObservable().pipe(
            map(resources => resources.find(r => r.id === id))
        );
    }

    updateResourceStatus(dto: UpdateResourceStatusDto): Observable<Resource> {
        // Optimistic update simulation
        const current = this.resourcesCache.value;
        const index = current.findIndex(r => r.id === dto.resourceId);

        if (index === -1) throw new Error('Resource not found');

        const updated = { ...current[index], status: dto.status, lastUpdated: Date.now() };
        if (dto.quantity !== undefined) updated.quantity = dto.quantity;

        const newCache = [...current];
        newCache[index] = updated;
        this.resourcesCache.next(newCache);

        return of(updated).pipe(delay(500)); // Simulate network delay
    }

    allocateResource(resourceId: string, quantity: number): Observable<boolean> {
        const current = this.resourcesCache.value;
        const index = current.findIndex(r => r.id === resourceId);

        if (index === -1) return of(false);

        const resource = current[index];
        if (resource.quantity < quantity) {
            return of(false); // Insufficient quantity
        }

        const remaining = resource.quantity - quantity;
        const status = remaining === 0 ? ResourceStatus.DEPLETED : resource.status;

        const updated = { ...resource, quantity: remaining, status, lastUpdated: Date.now() };

        const newCache = [...current];
        newCache[index] = updated;
        this.resourcesCache.next(newCache);

        return of(true).pipe(delay(500));
    }

    getTotalAvailableResources(): Observable<number> {
        return this.getResources().pipe(
            map(resources => resources
                .filter(r => r.status === ResourceStatus.AVAILABLE)
                .reduce((acc, curr) => acc + curr.quantity, 0)
            )
        );
    }

    private applyFilters(resources: Resource[], filters?: ResourceSearchFilters): Resource[] {
        if (!filters) return resources;

        return resources.filter(r => {
            let matches = true;
            if (filters.type) matches = matches && r.type === filters.type;
            if (filters.status) matches = matches && r.status === filters.status;
            if (filters.category) matches = matches && r.category === filters.category;
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                matches = matches && (
                    r.name.toLowerCase().includes(term) ||
                    r.location.facilityName?.toLowerCase().includes(term) || false
                );
            }
            return matches;
        });
    }
}
