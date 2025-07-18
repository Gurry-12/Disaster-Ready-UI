import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { LiveDisasterMap } from './live-disaster-map/live-disaster-map';
import { AlertNotification } from './alert-notification/alert-notification';
import { IncidentReporting } from './incident-reporting/incident-reporting';
import { ResourceAllocation } from './resource-allocation/resource-allocation';
import { PeopleShelterManagement } from './people-shelter-management/people-shelter-management';
import { AnalyticsHeatmaps } from './analytics-heatmaps/analytics-heatmaps';
import { CalendarComponent } from './calendar/calendar';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'dashboard', component: Dashboard },
  { path: 'live-disaster-map', component: LiveDisasterMap },
  { path: 'alert-notification', component: AlertNotification },
  { path: 'incident-reporting', component: IncidentReporting },
  { path: 'resource-allocation', component: ResourceAllocation },
  { path: 'people-shelter-management', component: PeopleShelterManagement },
  { path: 'analytics-heatmaps', component: AnalyticsHeatmaps },
  { path: 'calendar', component: CalendarComponent },
];
