/**
 * Incident Model
 * Represents a disaster incident reported by field responders
 */

export interface Incident {
    id: string;
    type: IncidentType;
    severity: IncidentSeverity;
    status: IncidentStatus;
    title: string;
    description: string;
    location: Location;
    reportedBy: string;
    reportedAt: number; // timestamp
    updatedAt: number; // timestamp
    assignedResources: string[]; // resource IDs
    affectedPopulation?: number;
    estimatedDamage?: string;
    images?: string[];
    priority: number; // 1-5, 5 being highest
    tags?: string[];
    // Offline sync metadata
    syncStatus: SyncStatus;
    localId?: string; // temporary ID for offline-created incidents
}

export enum IncidentType {
    FLOOD = 'flood',
    FIRE = 'fire',
    EARTHQUAKE = 'earthquake',
    CYCLONE = 'cyclone',
    LANDSLIDE = 'landslide',
    TSUNAMI = 'tsunami',
    DROUGHT = 'drought',
    EPIDEMIC = 'epidemic',
    INDUSTRIAL_ACCIDENT = 'industrial_accident',
    OTHER = 'other'
}

export enum IncidentSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum IncidentStatus {
    REPORTED = 'reported',
    ACKNOWLEDGED = 'acknowledged',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed'
}

export enum SyncStatus {
    SYNCED = 'synced',
    PENDING = 'pending',
    SYNCING = 'syncing',
    CONFLICT = 'conflict',
    ERROR = 'error'
}

export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    accuracy?: number; // GPS accuracy in meters
}

/**
 * DTO for creating new incidents
 */
export interface CreateIncidentDto {
    type: IncidentType;
    severity: IncidentSeverity;
    title: string;
    description: string;
    location: Location;
    affectedPopulation?: number;
    estimatedDamage?: string;
    images?: string[];
    tags?: string[];
}

/**
 * DTO for updating incidents
 */
export interface UpdateIncidentDto {
    id: string;
    status?: IncidentStatus;
    severity?: IncidentSeverity;
    description?: string;
    assignedResources?: string[];
    affectedPopulation?: number;
    estimatedDamage?: string;
}
