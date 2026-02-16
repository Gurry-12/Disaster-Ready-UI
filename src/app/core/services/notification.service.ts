import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface Alert {
    id: string;
    type: AlertType;
    message: string;
    timestamp: Date;
    timeout?: any; // For auto-dismiss timer
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private alertsSubject = new BehaviorSubject<Alert[]>([]);
    public alerts$ = this.alertsSubject.asObservable();

    private historySubject = new BehaviorSubject<Alert[]>([]);
    public history$ = this.historySubject.asObservable();

    constructor() { }

    show(message: string, type: AlertType = 'info', duration: number = 5000) {
        const id = crypto.randomUUID();
        const alert: Alert = {
            id,
            type,
            message,
            timestamp: new Date()
        };

        if (duration > 0) {
            alert.timeout = setTimeout(() => {
                this.dismiss(id);
            }, duration);
        }

        // Add to active alerts (Toasts)
        const currentAlerts = this.alertsSubject.value;
        this.alertsSubject.next([alert, ...currentAlerts]);

        // Add to history (Log)
        const history = this.historySubject.value;
        // Keep last 50 alerts
        const newHistory = [alert, ...history].slice(0, 50);
        this.historySubject.next(newHistory);
    }

    success(message: string, duration?: number) {
        this.show(message, 'success', duration);
    }

    error(message: string, duration?: number) {
        this.show(message, 'error', duration);
    }

    info(message: string, duration?: number) {
        this.show(message, 'info', duration);
    }

    warning(message: string, duration?: number) {
        this.show(message, 'warning', duration);
    }

    dismiss(id: string) {
        const currentAlerts = this.alertsSubject.value;
        const alert = currentAlerts.find(a => a.id === id);

        if (alert && alert.timeout) {
            clearTimeout(alert.timeout);
        }

        const updatedAlerts = currentAlerts.filter(a => a.id !== id);
        this.alertsSubject.next(updatedAlerts);
        // Note: We do NOT remove from history
    }

    clear() {
        this.alertsSubject.value.forEach(a => {
            if (a.timeout) clearTimeout(a.timeout);
        });
        this.alertsSubject.next([]);
    }

    clearHistory() {
        this.historySubject.next([]);
    }
}
