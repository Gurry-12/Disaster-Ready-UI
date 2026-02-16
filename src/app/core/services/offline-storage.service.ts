import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import type { Table } from 'dexie';
import { Incident, IncidentType, IncidentSeverity, IncidentStatus, SyncStatus } from '../../store/models/incident.model';
import { Resource } from '../../store/models/resource.model';
import { Shelter } from '../../store/models/shelter.model';

export class DisasterDatabase extends Dexie {
    incidents!: Table<Incident, string>;
    resources!: Table<Resource, string>;
    shelters!: Table<Shelter, string>;
    syncQueue!: Table<any, number>;

    constructor() {
        super('DisasterReadyDB');
        this.version(1).stores({
            incidents: 'id, type, status, syncStatus, severity',
            resources: 'id, type, status, location',
            shelters: 'id, status',
            syncQueue: '++id, action, status'
        });
    }
}

@Injectable({
    providedIn: 'root'
})
export class OfflineStorageService {
    public db: DisasterDatabase;

    constructor() {
        this.db = new DisasterDatabase();
    }

    // --- Incidents ---
    async getIncidents(): Promise<Incident[]> {
        return await this.db.incidents.toArray();
    }

    async getIncident(id: string): Promise<Incident | undefined> {
        return await this.db.incidents.get(id);
    }

    async saveIncident(incident: Incident): Promise<string> {
        return await this.db.incidents.put(incident);
    }

    async saveIncidents(incidents: Incident[]): Promise<string> {
        await this.db.incidents.bulkPut(incidents);
        return 'success';
    }

    async deleteIncident(id: string): Promise<void> {
        await this.db.incidents.delete(id);
    }

    // --- Sync Queue ---
    async addToSyncQueue(action: any): Promise<number> {
        return await this.db.syncQueue.add({
            action,
            status: 'pending',
            timestamp: Date.now()
        });
    }

    async getSyncQueue(): Promise<any[]> {
        return await this.db.syncQueue.where('status').equals('pending').toArray();
    }

    async removeFromSyncQueue(id: number): Promise<void> {
        await this.db.syncQueue.delete(id);
    }

    async clearSyncQueue(): Promise<void> {
        await this.db.syncQueue.clear();
    }
}
