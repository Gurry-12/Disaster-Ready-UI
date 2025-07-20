import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


interface Alert {
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}
@Component({
  selector: 'app-alert-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-notification.html',
  styleUrls: ['./alert-notification.css']
})
export class AlertNotification {
  alerts: Alert[] = [
    { type: 'info', message: 'All systems operational.', timestamp: new Date() },
    { type: 'warning', message: 'Heavy rainfall expected in Zone 2.', timestamp: new Date() },
    { type: 'error', message: 'Communication failure in Zone 4.', timestamp: new Date() }
  ];

  getIcon(type: string): string {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '⛔';
      default: return '🔔';
    }
  }

  dismissAlert(index: number): void {
    this.alerts.splice(index, 1);
  }
}
