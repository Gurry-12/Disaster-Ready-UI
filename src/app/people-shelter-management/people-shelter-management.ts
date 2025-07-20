import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

interface Person {
  name: string;
  age: number;
  status: string;
  photo: string;
}

@Component({
  selector: 'app-people-shelter-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './people-shelter-management.html',
  styleUrls: ['./people-shelter-management.css']
})
export class PeopleShelterManagement {
  people: Person[] = [
    { name: 'Ravi Kumar', age: 28, status: 'safe', photo: 'assets/photos/ravi.jpg' },
    { name: 'Priya Singh', age: 35, status: 'injured', photo: 'assets/photos/priya.jpg' }
  ];

  newPerson: {
    name: string;
    age: number | null;
    status: string;
    photo: string;
  } = {
    name: '',
    age: null,
    status: '',
    photo: 'assets/photos/default.png'
  };

  errorMessage = '';
  successMessage = '';

  addPerson() {
    if (!this.newPerson.name || this.newPerson.age === null || !this.newPerson.status) {
      this.errorMessage = 'Please fill out all fields.';
      this.successMessage = '';
      return;
    }

    this.people.push({
      name: this.newPerson.name,
      age: this.newPerson.age,
      status: this.newPerson.status,
      photo: this.newPerson.photo
    });

    this.successMessage = 'Person added successfully!';
    this.errorMessage = '';

    // Reset the form
    this.newPerson = {
      name: '',
      age: null,
      status: '',
      photo: 'assets/photos/default.png'
    };
  }
}

