export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'responder' | 'coordinator' | 'volunteer';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  profile?: {
    phone?: string;
    location?: string;
    emergencyContact?: string;
    skills?: string[];
  };
}

export interface UserProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills: string[];
  certifications: string[];
  availability: {
    isAvailable: boolean;
    preferredShifts: string[];
    maxHoursPerWeek: number;
  };
} 