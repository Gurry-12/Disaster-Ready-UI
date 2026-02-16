/**
 * Shelter Model
 * Represents emergency shelters for evacuees during disasters
 */

export interface Shelter {
    id: string;
    name: string;
    type: ShelterType;
    status: ShelterStatus;
    capacity: ShelterCapacity;
    location: ShelterLocation;
    amenities: Amenity[];
    contact: ContactInfo;
    operationalSince?: number; // timestamp
    managedBy: string; // organization or person
    description?: string;
    accessibility: AccessibilityFeatures;
    lastUpdated: number;
    // Offline sync metadata
    syncStatus: SyncStatus;
}

export enum ShelterType {
    TEMPORARY = 'temporary',
    PERMANENT = 'permanent',
    EVACUATION_CENTER = 'evacuation_center',
    RELIEF_CAMP = 'relief_camp',
    COMMUNITY_CENTER = 'community_center',
    SCHOOL = 'school',
    SPORTS_COMPLEX = 'sports_complex',
    OTHER = 'other'
}

export enum ShelterStatus {
    OPERATIONAL = 'operational',
    FULL = 'full',
    NEAR_CAPACITY = 'near_capacity',
    CLOSED = 'closed',
    UNDER_PREPARATION = 'under_preparation'
}

export enum SyncStatus {
    SYNCED = 'synced',
    PENDING = 'pending',
    SYNCING = 'syncing',
    CONFLICT = 'conflict',
    ERROR = 'error'
}

export interface ShelterCapacity {
    total: number;
    occupied: number;
    available: number;
    reserved?: number;
    // Breakdown by demographics
    families?: number;
    individuals?: number;
    children?: number;
    elderly?: number;
    disabled?: number;
}

export interface ShelterLocation {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    postalCode?: string;
    landmark?: string;
    distance?: number; // calculated distance from user
}

export interface ContactInfo {
    name: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
    role: string;
}

export interface Amenity {
    type: AmenityType;
    available: boolean;
    quantity?: number;
    notes?: string;
}

export enum AmenityType {
    FOOD = 'food',
    WATER = 'water',
    MEDICAL_FACILITY = 'medical_facility',
    SANITATION = 'sanitation',
    ELECTRICITY = 'electricity',
    INTERNET = 'internet',
    BLANKETS = 'blankets',
    CLOTHING = 'clothing',
    CHILDCARE = 'childcare',
    PET_FRIENDLY = 'pet_friendly',
    SECURITY = 'security',
    TRANSPORTATION = 'transportation'
}

export interface AccessibilityFeatures {
    wheelchairAccessible: boolean;
    elevatorAvailable: boolean;
    signLanguageSupport: boolean;
    brailleSignage: boolean;
    accessibleRestrooms: boolean;
    ramps: boolean;
    notes?: string;
}

/**
 * DTO for assigning evacuees to shelters
 */
export interface AssignEvacueesDto {
    shelterId: string;
    numberOfPeople: number;
    demographics?: {
        families?: number;
        individuals?: number;
        children?: number;
        elderly?: number;
        disabled?: number;
    };
    specialNeeds?: string[];
    estimatedArrival?: number;
}

/**
 * DTO for updating shelter capacity
 */
export interface UpdateShelterCapacityDto {
    shelterId: string;
    occupied: number;
    reserved?: number;
}

/**
 * Shelter search filters
 */
export interface ShelterSearchFilters {
    type?: ShelterType;
    status?: ShelterStatus;
    maxDistance?: number; // in kilometers
    minCapacity?: number;
    requiredAmenities?: AmenityType[];
    wheelchairAccessible?: boolean;
    petFriendly?: boolean;
}
