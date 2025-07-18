import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AlertPriority = 'critical' | 'moderate' | 'safe';

export interface Alert {
  id: number;
  message: string;
  priority: AlertPriority;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([
    { id: 1, message: 'Flood warning in Zone 3', priority: 'critical' },
    { id: 2, message: 'Fire contained in Sector 7', priority: 'moderate' },
    { id: 3, message: 'All clear in District 2', priority: 'safe' }
  ]);
  private nextId = 4;

  getAlerts(): Observable<Alert[]> {
    return this.alertsSubject.asObservable();
  }

  addAlert(message: string, priority: AlertPriority) {
    const newAlert: Alert = { id: this.nextId++, message, priority };
    this.alertsSubject.next([...this.alertsSubject.value, newAlert]);
  }

  removeAlert(id: number) {
    this.alertsSubject.next(this.alertsSubject.value.filter(a => a.id !== id));
  }

  clearAlerts() {
    this.alertsSubject.next([]);
    this.nextId = 1;
  }
}
