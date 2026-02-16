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
  status: string;
  photo: string;
  shelterId: string;
  checkInDate: number;
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
    { id: '1', name: 'Ravi Kumar', age: 28, status: 'safe', photo: 'https://i.pravatar.cc/150?u=ravi', shelterId: 'shelter-001', checkInDate: Date.now() },
    { id: '2', name: 'Priya Singh', age: 35, status: 'injured', photo: 'https://i.pravatar.cc/150?u=priya', shelterId: 'shelter-001', checkInDate: Date.now() - 86400000 }
  ];

  newPerson = {
    name: '',
    age: null as number | null,
    status: 'safe',
    shelterId: '',
    photo: 'https://i.pravatar.cc/150?u=default'
  };

  selectedShelterId = 'all';
  searchQuery = '';
  errorMessage = '';
  successMessage = '';

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
      return matchesSearch && matchesShelter;
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
      status: this.newPerson.status,
      photo: `https://i.pravatar.cc/150?u=${this.newPerson.name}`,
      shelterId: this.newPerson.shelterId,
      checkInDate: Date.now()
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

  private resetForm() {
    this.newPerson = {
      name: '',
      age: null,
      status: 'safe',
      shelterId: '',
      photo: 'https://i.pravatar.cc/150?u=default'
    };
  }
}


