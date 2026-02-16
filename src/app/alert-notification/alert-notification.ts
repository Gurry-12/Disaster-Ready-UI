import { Component, OnDestroy, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NotificationService, Alert, AlertType } from '../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-notification.html',
  styleUrls: ['./alert-notification.css']
})
export class AlertNotification implements OnInit, OnDestroy {
  @Input() isToast = true;
  alerts: Alert[] = [];
  subscription: Subscription = new Subscription();
  private route = inject(ActivatedRoute);

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    // Check if configured via Route Data (Page View)
    this.route.data.subscribe(data => {
      if (data['isToast'] !== undefined) {
        this.isToast = data['isToast'];
      }

      // Setup subscription based on mode
      const source$ = this.isToast ? this.notificationService.alerts$ : this.notificationService.history$;

      if (this.subscription) this.subscription.unsubscribe();
      this.subscription = source$.subscribe(alerts => {
        this.alerts = alerts;
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBIcon(type: AlertType): string {
    switch (type) {
      case 'info': return 'bi-info-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'error': return 'bi-exclamation-octagon-fill';
      case 'success': return 'bi-check-circle-fill';
      default: return 'bi-bell-fill';
    }
  }

  getIcon(type: AlertType): string {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '⛔';
      case 'success': return '✅';
      default: return '🔔';
    }
  }

  dismissAlert(id: string): void {
    this.notificationService.dismiss(id);
  }

  clearAll(): void {
    this.alerts = [];
  }
}

