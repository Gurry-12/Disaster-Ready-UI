import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customize-kit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customize-kit.html',
  styleUrls: ['./customize-kit.css']
})
export class CustomizeKit {
  disasterTypes = ['Earthquake', 'Flood', 'Fire', 'Cyclone', 'Landslide'];
  selectedDisaster = 'Earthquake';
  familySize = 1;
  hasPets = false;
  hasMedicalNeeds = false;

  baseItems = [
    { name: 'Water Bottle', perPerson: 2 },
    { name: 'Food Pack', perPerson: 3 },
    { name: 'Flashlight', perPerson: 1 },
    { name: 'Battery', perPerson: 2 },
    { name: 'First Aid Kit', perPerson: 1 },
    { name: 'Blanket', perPerson: 1 }
  ];

  petItems = [
    { name: 'Pet Food (2 days)', quantity: 2 },
    { name: 'Leash', quantity: 1 }
  ];

  medicalItems = [
    { name: 'Prescription Medicine (3 days)', quantity: 3 },
    { name: 'Inhaler', quantity: 1 }
  ];

  customChecklist: { name: string; quantity: number }[] = [];

  generateChecklist() {
    const list: { name: string; quantity: number }[] = [];

    this.baseItems.forEach(item => {
      list.push({
        name: item.name,
        quantity: item.perPerson * this.familySize
      });
    });

    if (this.hasPets) {
      this.petItems.forEach(item => list.push(item));
    }

    if (this.hasMedicalNeeds) {
      this.medicalItems.forEach(item => list.push(item));
    }

    this.customChecklist = list;
  }
}
