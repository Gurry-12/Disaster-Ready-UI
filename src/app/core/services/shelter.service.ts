import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { Shelter, ShelterStatus, ShelterSearchFilters } from '../../store/models/shelter.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShelterService {
    private http = inject(HttpClient);
    private mockUrl = '/assets/data/mock-shelters.json';

    private sheltersSubject = new BehaviorSubject<Shelter[]>([]);
    public shelters$ = this.sheltersSubject.asObservable();
    private initialized = false;

    getShelters(filters?: ShelterSearchFilters): Observable<Shelter[]> {
        if (!this.initialized && !environment.production) {
            return this.http.get<Shelter[]>(this.mockUrl).pipe(
                tap(shelters => {
                    this.sheltersSubject.next(shelters);
                    this.initialized = true;
                }),
                map(shelters => this.applyFilters(shelters, filters))
            );
        }
        return this.shelters$.pipe(
            map(shelters => this.applyFilters(shelters, filters))
        );
    }

    getShelterById(id: string): Observable<Shelter | undefined> {
        return this.shelters$.pipe(
            map(shelters => shelters.find(s => s.id === id))
        );
    }

    updateCapacity(shelterId: string, occupied: number): Observable<Shelter | null> {
        const current = this.sheltersSubject.value;
        const index = current.findIndex(s => s.id === shelterId);

        if (index === -1) return of(null);

        const shelter = { ...current[index] };
        shelter.capacity = {
            ...shelter.capacity,
            occupied,
            available: shelter.capacity.total - occupied
        };

        // Update status based on occupancy
        const percentage = (occupied / shelter.capacity.total) * 100;
        if (percentage >= 100) shelter.status = ShelterStatus.FULL;
        else if (percentage >= 80) shelter.status = ShelterStatus.NEAR_CAPACITY;
        else if (percentage > 0) shelter.status = ShelterStatus.OPERATIONAL;

        const updatedShelters = [...current];
        updatedShelters[index] = shelter;
        this.sheltersSubject.next(updatedShelters);

        return of(shelter).pipe(delay(500));
    }

    private applyFilters(shelters: Shelter[], filters?: ShelterSearchFilters): Shelter[] {
        if (!filters) return shelters;

        return shelters.filter(s => {
            let matches = true;
            if (filters.type) matches = matches && s.type === filters.type;
            if (filters.status) matches = matches && s.status === filters.status;
            if (filters.minCapacity) matches = matches && s.capacity.available >= filters.minCapacity;
            if (filters.wheelchairAccessible !== undefined) {
                matches = matches && s.accessibility.wheelchairAccessible === filters.wheelchairAccessible;
            }
            return matches;
        });
    }
}
