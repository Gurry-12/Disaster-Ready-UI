import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ResourceService } from '../core/services/resource.service';
import { NotificationService } from '../core/services/notification.service';
import * as IncidentActions from '../store/incidents/incident.actions';
import { selectAllIncidents } from '../store/incidents/incident.selectors';
import { ResourceStatus } from '../store/models/resource.model';

@Component({
  selector: 'app-resource-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-allocation.html',
  styleUrls: ['./resource-allocation.css']
})
export class ResourceAllocation implements OnInit {
  private store = inject(Store);
  private resourceService = inject(ResourceService);
  private notificationService = inject(NotificationService);

  incidents$ = this.store.select(selectAllIncidents);
  resources$ = this.resourceService.getResources().pipe(
    map(resources => resources.filter(r => r.status === ResourceStatus.AVAILABLE && r.quantity > 0))
  );

  selectedIncidentId = '';
  selectedResourceId = '';
  quantity = 1;
  isSubmitting = false;

  ngOnInit() {
    this.store.dispatch(IncidentActions.loadIncidents());
  }

  getIconForIncident(type: string | undefined): string {
    const icons: Record<string, string> = {
      'fire': 'bi-fire',
      'flood': 'bi-water',
      'earthquake': 'bi-grid-3x3',
      'medical': 'bi-heart-pulse',
      'other': 'bi-exclamation-triangle'
    };
    return icons[type?.toLowerCase() || 'other'] || 'bi-exclamation-triangle';
  }

  getTypeIcon(category: string | undefined): string {
    const icons: Record<string, string> = {
      'VEHICLE': 'bi-truck',
      'PERSONNEL': 'bi-people',
      'EQUIPMENT': 'bi-tools',
      'SUPPLY': 'bi-box-seam',
      'MEDICAL': 'bi-hospital'
    };
    return icons[category?.toUpperCase() || 'SUPPLY'] || 'bi-box-seam';
  }

  allocate() {
    if (!this.selectedIncidentId || !this.selectedResourceId || this.quantity <= 0) {
      this.notificationService.warning('Please select incident, resource and valid quantity.');
      return;
    }

    this.isSubmitting = true;
    this.resourceService.allocateResource(this.selectedResourceId, this.quantity).subscribe(success => {
      this.isSubmitting = false;
      if (success) {
        this.notificationService.success('Resource allocated successfully!');
        this.resetForm();
      } else {
        this.notificationService.error('Allocation failed. Insufficient quantity or resource unavailable.');
      }
    });
  }

  selectIncident(id: string) {
    this.selectedIncidentId = id;
  }

  selectResource(id: string) {
    this.selectedResourceId = id;
  }

  resetForm() {
    this.selectedIncidentId = '';
    this.selectedResourceId = '';
    this.quantity = 1;
  }
}
