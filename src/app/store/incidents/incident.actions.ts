import { createAction, props } from '@ngrx/store';
import { Incident, CreateIncidentDto, UpdateIncidentDto, IncidentType } from '../models/incident.model';

// Load Incidents
export const loadIncidents = createAction(
    '[Incident] Load Incidents'
);

export const loadIncidentsSuccess = createAction(
    '[Incident] Load Incidents Success',
    props<{ incidents: Incident[] }>()
);

export const loadIncidentsFailure = createAction(
    '[Incident] Load Incidents Failure',
    props<{ error: string }>()
);

// Load Single Incident
export const loadIncident = createAction(
    '[Incident] Load Incident',
    props<{ id: string }>()
);

export const loadIncidentSuccess = createAction(
    '[Incident] Load Incident Success',
    props<{ incident: Incident }>()
);

export const loadIncidentFailure = createAction(
    '[Incident] Load Incident Failure',
    props<{ error: string }>()
);

// Create Incident
export const createIncident = createAction(
    '[Incident] Create Incident',
    props<{ incident: CreateIncidentDto }>()
);

export const createIncidentSuccess = createAction(
    '[Incident] Create Incident Success',
    props<{ incident: Incident, tempId?: string }>()
);

export const createIncidentFailure = createAction(
    '[Incident] Create Incident Failure',
    props<{ error: string, tempId?: string }>()
);

// Update Incident
export const updateIncident = createAction(
    '[Incident] Update Incident',
    props<{ incident: UpdateIncidentDto }>()
);

export const updateIncidentSuccess = createAction(
    '[Incident] Update Incident Success',
    props<{ incident: Partial<Incident> }>()
);

export const updateIncidentFailure = createAction(
    '[Incident] Update Incident Failure',
    props<{ error: string, id: string }>()
);

// Real-time Updates (WebSocket)
export const receiveIncidentUpdate = createAction(
    '[Incident] Receive Incident Update',
    props<{ incident: Incident }>()
);

// Offline Sync
export const syncIncidents = createAction(
    '[Incident] Sync Incidents'
);

export const syncIncidentsSuccess = createAction(
    '[Incident] Sync Incidents Success',
    props<{ syncedCount: number }>()
);

export const syncIncidentsFailure = createAction(
    '[Incident] Sync Incidents Failure',
    props<{ error: string }>()
);

// Filters & Selection
export const selectIncident = createAction(
    '[Incident] Select Incident',
    props<{ id: string }>()
);

export const clearSelectedIncident = createAction(
    '[Incident] Clear Selected Incident'
);

export const setIncidentFilter = createAction(
    '[Incident] Set Filter',
    props<{ filter: { type?: IncidentType, status?: string } }>()
);
