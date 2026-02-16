import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import * as IncidentActions from './incident.actions';
import { IncidentService } from '../../core/services/incident.service';

@Injectable()
export class IncidentEffects {

    private actions$ = inject(Actions);
    private incidentService = inject(IncidentService);

    loadIncidents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(IncidentActions.loadIncidents),
            mergeMap(() =>
                this.incidentService.getIncidents().pipe(
                    map(incidents => IncidentActions.loadIncidentsSuccess({ incidents })),
                    catchError(error => of(IncidentActions.loadIncidentsFailure({ error: error.message })))
                )
            )
        )
    );

    loadIncident$ = createEffect(() =>
        this.actions$.pipe(
            ofType(IncidentActions.loadIncident),
            mergeMap(action =>
                this.incidentService.getIncident(action.id).pipe(
                    map(incident => {
                        if (incident) {
                            return IncidentActions.loadIncidentSuccess({ incident });
                        } else {
                            return IncidentActions.loadIncidentFailure({ error: 'Incident not found' });
                        }
                    }),
                    catchError(error => of(IncidentActions.loadIncidentFailure({ error: error.message })))
                )
            )
        )
    );

    createIncident$ = createEffect(() =>
        this.actions$.pipe(
            ofType(IncidentActions.createIncident),
            mergeMap(action =>
                this.incidentService.createIncident(action.incident).pipe(
                    map(incident => IncidentActions.createIncidentSuccess({ incident })),
                    catchError(error => of(IncidentActions.createIncidentFailure({ error: error.message })))
                )
            )
        )
    );

    // Example of handling sync success
    syncIncidents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(IncidentActions.syncIncidents),
            // Call sync logic in service
            // For now just a placeholder
            map(() => IncidentActions.syncIncidentsSuccess({ syncedCount: 0 }))
        )
    );
}
