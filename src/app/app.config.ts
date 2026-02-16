import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { incidentReducer, incidentsFeatureKey } from './store/incidents/incident.reducer';
import { IncidentEffects } from './store/incidents/incident.effects';

// SECURITY NOTE: Interceptors are available but commented out to avoid build issues
// Uncomment and configure these when you're ready to use them:
//
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { csrfInterceptor } from './shared/interceptors/csrf.interceptor';
import { httpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
//
// Then add to provideHttpClient:
// provideHttpClient(withInterceptors([authInterceptor, csrfInterceptor, httpErrorInterceptor]))

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, csrfInterceptor, httpErrorInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideStore({
      [incidentsFeatureKey]: incidentReducer
    }),
    provideEffects([
      IncidentEffects
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ]
};

import { Chart, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

Chart.register(...registerables, MatrixController, MatrixElement);
