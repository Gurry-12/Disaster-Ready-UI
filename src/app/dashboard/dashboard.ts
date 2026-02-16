import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { RealTimeService } from '../core/services/real-time.service';
import { NotificationService } from '../core/services/notification.service';
import * as IncidentActions from '../store/incidents/incident.actions';
import { selectActiveIncidentsCount, selectIncidentsBySeverity, selectAllIncidents } from '../store/incidents/incident.selectors';
import { IncidentSeverity } from '../store/models/incident.model';
import { ResourceService } from '../core/services/resource.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  private store = inject(Store);
  private realTimeService = inject(RealTimeService);
  private notificationService = inject(NotificationService);
  private resourceService = inject(ResourceService);
  private destroy$ = new Subject<void>();

  // Metrics Observables
  activeIncidentsCount$ = this.store.select(selectActiveIncidentsCount);
  criticalIncidentsCount$ = this.store.select(selectIncidentsBySeverity).pipe(
    map(counts => counts[IncidentSeverity.CRITICAL] || 0),
    tap(count => {
      if (count > 0) this.notificationService.warning(`${count} Critical Incidents Active!`);
    })
  );

  // Recent Critical Incidents for the Feed
  recentCriticalIncidents$ = this.store.select(selectAllIncidents).pipe(
    map(incidents => incidents.filter(i => i.severity === IncidentSeverity.CRITICAL || i.severity === IncidentSeverity.HIGH).slice(0, 3))
  );

  // Real Data from Services
  resourcesAvailable$ = this.resourceService.getTotalAvailableResources();
  resourceCategories$ = of([
    { label: 'Medical', value: 85, icon: 'bi-heart-pulse' },
    { label: 'Food/Water', value: 62, icon: 'bi-droplet' },
    { label: 'Supplies', value: 45, icon: 'bi-box-seam' }
  ]);

  sheltersOpen$ = of(12);
  activeTeams$ = of(24);

  // Live indicator state
  isLive = true;
  lastUpdate$ = new BehaviorSubject<number>(Date.now());

  ngOnInit() {
    this.store.dispatch(IncidentActions.loadIncidents());

    this.realTimeService.getIncidentUpdates()
      .pipe(takeUntil(this.destroy$))
      .subscribe(incident => {
        this.store.dispatch(IncidentActions.receiveIncidentUpdate({ incident }));
        this.lastUpdate$.next(Date.now());
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

