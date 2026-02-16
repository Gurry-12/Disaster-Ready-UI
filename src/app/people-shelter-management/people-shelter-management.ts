import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, map } from 'rxjs';
import { ShelterService } from '../core/services/shelter.service';
import { Shelter, ShelterStatus, ShelterType } from '../store/models/shelter.model';
import { FilterByIdPipe } from '../shared/pipes/filter-by-id.pipe';

interface Person {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  status: 'safe' | 'injured' | 'missing' | 'treatment';
  photo: string;
  shelterId: string;
  checkInDate: number;
  contact: string;
}

interface NewPerson {
  name: string;
  age: number | null;
  gender: 'male' | 'female' | 'other';
  status: 'safe' | 'injured' | 'missing' | 'treatment';
  shelterId: string;
  contact: string;
  photo: string;
}

@Component({
  selector: 'app-people-shelter-management',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterByIdPipe],
  templateUrl: './people-shelter-management.html',
  styleUrls: ['./people-shelter-management.css']
})
export class PeopleShelterManagement implements OnInit, OnDestroy {
  private shelterService = inject(ShelterService);
  private destroy$ = new Subject<void>();

  shelters: Shelter[] = [];
  people: Person[] = [
    { id: '1', name: 'Ravi Kumar', age: 28, gender: 'male', status: 'safe', photo: 'https://i.pravatar.cc/150?u=ravi', shelterId: 'shelter-001', checkInDate: Date.now() - 3600000, contact: '+91 98765 43210' },
    { id: '2', name: 'Priya Singh', age: 35, gender: 'female', status: 'injured', photo: 'https://i.pravatar.cc/150?u=priya', shelterId: 'shelter-001', checkInDate: Date.now() - 86400000, contact: '+91 87654 32109' },
    { id: '3', name: 'Arjun Das', age: 42, gender: 'male', status: 'safe', photo: 'https://i.pravatar.cc/150?u=arjun', shelterId: 'shelter-002', checkInDate: Date.now() - 43200000, contact: '+91 76543 21098' },
    { id: '4', name: 'Sneha Rao', age: 22, gender: 'female', status: 'missing', photo: 'https://i.pravatar.cc/150?u=sneha', shelterId: 'shelter-003', checkInDate: Date.now() - 172800000, contact: 'Unknown' },
    { id: '5', name: 'Vikram Mehta', age: 55, gender: 'male', status: 'treatment', photo: 'https://i.pravatar.cc/150?u=vikram', shelterId: 'shelter-001', checkInDate: Date.now() - 1800000, contact: '+91 65432 10987' }
  ];

  newPerson: NewPerson = {
    name: '',
    age: null,
    gender: 'male',
    status: 'safe',
    shelterId: '',
    contact: '',
    photo: 'https://i.pravatar.cc/150?u=default'
  };

  selectedShelterId = 'all';
  selectedStatus = 'all';
  searchQuery = '';
  errorMessage = '';
  successMessage = '';
  editingPerson: Person | null = null;

  ngOnInit() {
    this.shelterService.getShelters()
      .pipe(takeUntil(this.destroy$))
      .subscribe(shelters => {
        this.shelters = shelters;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filteredShelters() {
    return this.shelters.filter(s =>
      this.selectedShelterId === 'all' || s.id === this.selectedShelterId
    );
  }

  get filteredPeople() {
    return this.people.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesShelter = this.selectedShelterId === 'all' || p.shelterId === this.selectedShelterId;
      const matchesStatus = this.selectedStatus === 'all' || p.status === this.selectedStatus;
      return matchesSearch && matchesShelter && matchesStatus;
    });
  }

  addPerson() {
    if (!this.newPerson.name || this.newPerson.age === null || !this.newPerson.shelterId) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    const shelter = this.shelters.find(s => s.id === this.newPerson.shelterId);
    if (shelter && shelter.status === ShelterStatus.FULL) {
      this.errorMessage = 'Selected shelter is already full!';
      return;
    }

    const person: Person = {
      id: crypto.randomUUID(),
      name: this.newPerson.name,
      age: this.newPerson.age,
      gender: this.newPerson.gender,
      status: this.newPerson.status,
      photo: `https://i.pravatar.cc/150?u=${this.newPerson.name}`,
      shelterId: this.newPerson.shelterId,
      checkInDate: Date.now(),
      contact: this.newPerson.contact || 'N/A'
    };

    this.people.push(person);

    // Update shelter capacity in service
    if (shelter) {
      this.shelterService.updateCapacity(shelter.id, shelter.capacity.occupied + 1).subscribe();
    }

    this.successMessage = 'Person checked in successfully!';
    this.errorMessage = '';
    this.resetForm();
  }

  removePerson(personId: string) {
    const person = this.people.find(p => p.id === personId);
    if (!person) return;

    this.people = this.people.filter(p => p.id !== personId);

    const shelter = this.shelters.find(s => s.id === person.shelterId);
    if (shelter) {
      this.shelterService.updateCapacity(shelter.id, Math.max(0, shelter.capacity.occupied - 1)).subscribe();
    }
  }

  getOccupancyPercentage(shelter: Shelter): number {
    return (shelter.capacity.occupied / shelter.capacity.total) * 100;
  }

  getOccupancyColor(shelter: Shelter): string {
    const percent = this.getOccupancyPercentage(shelter);
    if (percent >= 100) return '#ef4444'; // Red
    if (percent >= 80) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  }

  getShelterTypeIcon(type: string): string {
    switch (type) {
      case ShelterType.SCHOOL: return 'bi-mortarboard-fill';
      case ShelterType.SPORTS_COMPLEX: return 'bi-dribbble';
      case ShelterType.COMMUNITY_CENTER: return 'bi-people-fill';
      case ShelterType.EVACUATION_CENTER: return 'bi-shield-fill-plus';
      case ShelterType.RELIEF_CAMP: return 'bi-house-door-fill';
      case ShelterType.PERMANENT: return 'bi-building-fill-check';
      default: return 'bi-building-fill';
    }
  }

  updatePersonStatus(personId: string, newStatus: any) {
    const person = this.people.find(p => p.id === personId);
    if (person) {
      person.status = newStatus;
      this.successMessage = `Status updated for ${person.name}`;
      setTimeout(() => this.successMessage = '', 3000);
    }
  }

  updateShelterStatus(shelterId: string, newStatus: any) {
    const shelter = this.shelters.find(s => s.id === shelterId);
    if (shelter) {
      // In a real app, this would call the service and then update the local state
      // For now we update local state and show a notification
      const updatedShelters = this.shelters.map(s =>
        s.id === shelterId ? { ...s, status: newStatus as ShelterStatus, lastUpdated: Date.now() } : s
      );
      this.shelters = updatedShelters;
      this.successMessage = `${shelter.name} status updated to ${newStatus}`;
      setTimeout(() => this.successMessage = '', 3000);
    }
  }

  private resetForm() {
    this.newPerson = {
      name: '',
      age: null,
      gender: 'male',
      status: 'safe',
      shelterId: '',
      contact: '',
      photo: 'https://i.pravatar.cc/150?u=default'
    };
  }
}


