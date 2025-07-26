import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

// Auth Components
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

// Main Components
import { Dashboard } from './dashboard/dashboard';
import { LiveDisasterMap } from './live-disaster-map/live-disaster-map';
import { AlertNotification } from './alert-notification/alert-notification';
import { IncidentReporting } from './incident-reporting/incident-reporting';
import { ResourceAllocation } from './resource-allocation/resource-allocation';
import { ResourceOverview } from './resource-overview/resource-overview';
import { PeopleShelterManagement } from './people-shelter-management/people-shelter-management';
import { AnalyticsHeatmaps } from './analytics-heatmaps/analytics-heatmaps';
import { CalendarComponent } from './calendar/calendar';
import { CustomizeKit } from './customize-kit/customize-kit';
import { ChangePassword } from './change-password/change-password';
import { Profile } from './profile/profile';
import { DisasterReportForm } from './disaster-report-form/disaster-report-form';

export const routes: Routes = [
  // Public routes (no auth required)
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPasswordComponent },
  
  // Protected routes (auth required)
  { 
    path: '', 
    component: Dashboard, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'live-disaster-map', 
    component: LiveDisasterMap, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'alert-notification', 
    component: AlertNotification, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'incident-reporting', 
    component: IncidentReporting, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'resource-allocation', 
    component: ResourceAllocation, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'resource-overview', 
    component: ResourceOverview, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'people-shelter-management', 
    component: PeopleShelterManagement, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'analytics-heatmaps', 
    component: AnalyticsHeatmaps, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'calendar', 
    component: CalendarComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'customize-kit', 
    component: CustomizeKit, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'change-password', 
    component: ChangePassword, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile', 
    component: Profile, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'disaster-report-form', 
    component: DisasterReportForm, 
    canActivate: [AuthGuard] 
  },
  
  // Redirect to dashboard for any unmatched routes
  { path: '**', redirectTo: '/dashboard' }
];
