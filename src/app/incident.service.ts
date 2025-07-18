import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Incident {
  id: number;
  type: string;
  location: string;
  description: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private incidentsSubject = new BehaviorSubject<Incident[]>([]);
  private nextId = 1;

  getIncidents(): Observable<Incident[]> {
    return this.incidentsSubject.asObservable();
  }

  addIncident(incident: Omit<Incident, 'id'>) {
    const newIncident: Incident = { id: this.nextId++, ...incident };
    this.incidentsSubject.next([...this.incidentsSubject.value, newIncident]);
  }

  clearIncidents() {
    this.incidentsSubject.next([]);
    this.nextId = 1;
  }
}
