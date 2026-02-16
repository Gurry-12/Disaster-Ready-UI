import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Incident, IncidentType, SyncStatus } from '../models/incident.model';
import * as IncidentActions from './incident.actions';

export const incidentsFeatureKey = 'incidents';

export interface IncidentState extends EntityState<Incident> {
    // additional entities state
    selectedIncidentId: string | null;
    loading: boolean;
    error: string | null;
    lastSync: number | null;
    filter: {
        type?: IncidentType;
        status?: string;
    };
}

export const adapter: EntityAdapter<Incident> = createEntityAdapter<Incident>({
    selectId: (incident: Incident) => incident.id,
    sortComparer: (a: Incident, b: Incident) => {
        // Sort by priority (desc) then by reportedAt (desc)
        if (a.priority !== b.priority) {
            return b.priority - a.priority;
        }
        return b.reportedAt - a.reportedAt;
    }
});

export const initialState: IncidentState = adapter.getInitialState({
    // additional entity state properties
    selectedIncidentId: null,
    loading: false,
    error: null,
    lastSync: null,
    filter: {}
});

export const incidentReducer = createReducer(
    initialState,

    // Load Incidents
    on(IncidentActions.loadIncidents, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(IncidentActions.loadIncidentsSuccess, (state, { incidents }) =>
        adapter.setAll(incidents, {
            ...state,
            loading: false,
            lastSync: Date.now(),
            error: null
        })
    ),
    on(IncidentActions.loadIncidentsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Single Incident
    on(IncidentActions.loadIncident, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(IncidentActions.loadIncidentSuccess, (state, { incident }) =>
        adapter.upsertOne(incident, {
            ...state,
            loading: false,
            selectedIncidentId: incident.id,
            error: null
        })
    ),
    on(IncidentActions.loadIncidentFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Incident
    on(IncidentActions.createIncident, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(IncidentActions.createIncidentSuccess, (state, { incident }) =>
        adapter.addOne(incident, {
            ...state,
            loading: false,
            error: null
        })
    ),
    on(IncidentActions.createIncidentFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Update Incident
    on(IncidentActions.updateIncident, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(IncidentActions.updateIncidentSuccess, (state, { incident }) =>
        adapter.updateOne({
            id: incident.id as string,
            changes: incident
        }, {
            ...state,
            loading: false,
            error: null
        })
    ),
    on(IncidentActions.updateIncidentFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Real-time Updates
    on(IncidentActions.receiveIncidentUpdate, (state, { incident }) =>
        adapter.upsertOne(incident, state)
    ),

    // Filter & Selection
    on(IncidentActions.selectIncident, (state, { id }) => ({
        ...state,
        selectedIncidentId: id
    })),
    on(IncidentActions.clearSelectedIncident, (state) => ({
        ...state,
        selectedIncidentId: null
    })),
    on(IncidentActions.setIncidentFilter, (state, { filter }) => ({
        ...state,
        filter
    }))
);

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();
