/**
 * Resource Model
 * Represents resources (personnel, equipment, supplies) available for disaster response
 */

export interface Resource {
    id: string;
    name: string;
    type: ResourceType;
    category: ResourceCategory;
    status: ResourceStatus;
    quantity: number;
    unit: string; // e.g., 'units', 'kg', 'liters', 'personnel'
    location: ResourceLocation;
    assignedTo?: string; // incident ID if assigned
    assignedAt?: number; // timestamp
    estimatedArrival?: number; // timestamp
    description?: string;
    specifications?: Record<string, any>;
    contact?: ContactInfo;
    lastUpdated: number;
    // Offline sync metadata
    syncStatus: SyncStatus;
}

export enum ResourceType {
    PERSONNEL = 'personnel',
    MEDICAL_SUPPLIES = 'medical_supplies',
    FOOD_WATER = 'food_water',
    EQUIPMENT = 'equipment',
    VEHICLE = 'vehicle',
    SHELTER_MATERIALS = 'shelter_materials',
    COMMUNICATION = 'communication',
    POWER_GENERATOR = 'power_generator',
    OTHER = 'other'
}

export enum ResourceCategory {
    EMERGENCY_RESPONSE = 'emergency_response',
    MEDICAL = 'medical',
    LOGISTICS = 'logistics',
    INFRASTRUCTURE = 'infrastructure',
    HUMANITARIAN = 'humanitarian'
}

export enum ResourceStatus {
    AVAILABLE = 'available',
    ASSIGNED = 'assigned',
    IN_TRANSIT = 'in_transit',
    DEPLOYED = 'deployed',
    DEPLETED = 'depleted',
    MAINTENANCE = 'maintenance',
    UNAVAILABLE = 'unavailable'
}

export enum SyncStatus {
    SYNCED = 'synced',
    PENDING = 'pending',
    SYNCING = 'syncing',
    CONFLICT = 'conflict',
    ERROR = 'error'
}

export interface ResourceLocation {
    latitude: number;
    longitude: number;
    address?: string;
    facilityName?: string;
    distance?: number; // calculated distance from user's location
}

export interface ContactInfo {
    name: string;
    phone: string;
    email?: string;
    role?: string;
}

/**
 * DTO for resource allocation
 */
export interface AllocateResourceDto {
    resourceId: string;
    incidentId: string;
    quantity: number;
    estimatedArrival?: number;
    notes?: string;
}

/**
 * DTO for updating resource status
 */
export interface UpdateResourceStatusDto {
    resourceId: string;
    status: ResourceStatus;
    location?: ResourceLocation;
    quantity?: number;
}

/**
 * Resource search filters
 */
export interface ResourceSearchFilters {
    type?: ResourceType;
    category?: ResourceCategory;
    status?: ResourceStatus;
    maxDistance?: number; // in kilometers
    minQuantity?: number;
    searchTerm?: string;
}
