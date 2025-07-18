import { Component, OnInit } from '@angular/core';
import { AlertService, Alert, AlertPriority } from '../alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-notification',
  imports: [CommonModule, FormsModule],
  templateUrl: './alert-notification.html',
  styleUrl: './alert-notification.css',
  providers: []
})
export class AlertNotification implements OnInit {
  alerts: Alert[] = [];
  newMessage = '';
  newPriority: AlertPriority = 'critical';

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getAlerts().subscribe(data => {
      this.alerts = data;
    });
  }

  addAlert() {
    if (!this.newMessage) return;
    this.alertService.addAlert(this.newMessage, this.newPriority);
    this.newMessage = '';
    this.newPriority = 'critical';
  }

  removeAlert(id: number) {
    this.alertService.removeAlert(id);
  }
}
