import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { ResourceService } from '../core/services/resource.service';
import { Resource, ResourceSearchFilters, ResourceStatus, ResourceType } from '../store/models/resource.model';

@Component({
  selector: 'app-resource-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-overview.html',
  styleUrl: './resource-overview.css'
})
export class ResourceOverview {
  private resourceService = inject(ResourceService);

  // Filter State
  searchTerm$ = new BehaviorSubject<string>('');
  statusFilter$ = new BehaviorSubject<ResourceStatus | 'all'>('all');

  // Resources Stream
  resources$: Observable<Resource[]> = combineLatest([
    this.searchTerm$,
    this.statusFilter$
  ]).pipe(
    switchMap(([term, status]) => {
      const filters: ResourceSearchFilters = {};
      if (term) filters.searchTerm = term;
      if (status !== 'all') filters.status = status as ResourceStatus;
      return this.resourceService.getResources(filters);
    })
  );

  // For template
  ResourceStatus = ResourceStatus;
  statusOptions = ['all', ...Object.values(ResourceStatus)];

  getStatusClass(status: string): string {
    switch (status) {
      case ResourceStatus.AVAILABLE: return 'available';
      case ResourceStatus.DEPLOYED: return 'deployed';
      case ResourceStatus.IN_TRANSIT: return 'transit';
      case ResourceStatus.MAINTENANCE: return 'maintenance';
      case ResourceStatus.DEPLETED: return 'depleted';
      default: return '';
    }
  }

  updateStatusFilter(value: string) {
    this.statusFilter$.next(value as ResourceStatus | 'all');
  }
}
