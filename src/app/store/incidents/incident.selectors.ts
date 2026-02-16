import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IncidentState, incidentsFeatureKey, adapter } from './incident.reducer';
import { Incident } from '../models/incident.model';

// Feature Selector
export const selectIncidentState = createFeatureSelector<IncidentState>(incidentsFeatureKey);

// Entity Selectors
const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors(selectIncidentState);

export const selectIncidentIds = selectIds;
export const selectIncidentEntities = selectEntities;
export const selectAllIncidents = selectAll;
export const selectIncidentTotal = selectTotal;

// Additional State Selectors
export const selectIncidentLoading = createSelector(
    selectIncidentState,
    (state) => state.loading
);

export const selectIncidentError = createSelector(
    selectIncidentState,
    (state) => state.error
);

export const selectLastSyncTime = createSelector(
    selectIncidentState,
    (state) => state.lastSync
);

export const selectSelectedIncidentId = createSelector(
    selectIncidentState,
    (state) => state.selectedIncidentId
);

export const selectIncidentFilter = createSelector(
    selectIncidentState,
    (state) => state.filter
);

// Complex / Derived Selectors
export const selectSelectedIncident = createSelector(
    selectIncidentEntities,
    selectSelectedIncidentId,
    (entities, selectedId) => selectedId ? entities[selectedId] || null : null
);

export const selectFilteredIncidents = createSelector(
    selectAllIncidents,
    selectIncidentFilter,
    (incidents, filter) => {
        if (!filter || (!filter.type && !filter.status)) {
            return incidents;
        }

        return incidents.filter(incident => {
            const matchesType = !filter.type || incident.type === filter.type;
            const matchesStatus = !filter.status || incident.status === filter.status;
            return matchesType && matchesStatus;
        });
    }
);

// Statistics Selectors
export const selectIncidentsBySeverity = createSelector(
    selectAllIncidents,
    (incidents) => {
        return incidents.reduce((acc, incident) => {
            acc[incident.severity] = (acc[incident.severity] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }
);

export const selectActiveIncidentsCount = createSelector(
    selectAllIncidents,
    (incidents) => incidents.filter(i => i.status !== 'closed' && i.status !== 'resolved').length
);
