import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface KitItem {
  id: string;
  name: string;
  quantity: number;
  category: 'Essentials' | 'Medical' | 'Pets' | 'Hygiene' | 'Tools';
  icon: string;
  priority: 'High' | 'Medium' | 'Low';
  checked?: boolean;
}

@Component({
  selector: 'app-customize-kit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customize-kit.html',
  styleUrls: ['./customize-kit.css']
})
export class CustomizeKit implements OnInit {
  disasterTypes = [
    { name: 'Earthquake', icon: 'bi-grid-3x3' },
    { name: 'Flood', icon: 'bi-water' },
    { name: 'Fire', icon: 'bi-fire' },
    { name: 'Cyclone', icon: 'bi-wind' },
    { name: 'Landslide', icon: 'bi-layers-half' }
  ];

  selectedDisaster = 'Earthquake';
  familySize = 2;
  hasPets = false;
  hasMedicalNeeds = false;
  daysToLast = 3;
  manifestFinalized = signal(false);

  customChecklist: KitItem[] = [];

  ngOnInit() {
    this.generateChecklist();
  }

  generateChecklist() {
    const list: KitItem[] = [
      { id: '1', name: 'Drinking Water', quantity: 4 * this.familySize * this.daysToLast, category: 'Essentials', icon: 'bi-droplet-fill', priority: 'High', checked: false },
      { id: '2', name: 'Non-Perishable Food', quantity: 3 * this.familySize * this.daysToLast, category: 'Essentials', icon: 'bi-box-seam', priority: 'High', checked: false },
      { id: '3', name: 'First Aid Kit', quantity: 1, category: 'Medical', icon: 'bi-plus-circle-fill', priority: 'High', checked: false },
      { id: '4', name: 'Flashlight', quantity: Math.ceil(this.familySize / 2), category: 'Tools', icon: 'bi-flashlight', priority: 'Medium', checked: false },
      { id: '5', name: 'Backup Batteries', quantity: 4, category: 'Tools', icon: 'bi-battery-full', priority: 'Medium', checked: false },
      { id: '6', name: 'Emergency Blanket', quantity: this.familySize, category: 'Essentials', icon: 'bi-wind', priority: 'Medium', checked: false },
      { id: '7', name: 'Whistle', quantity: 1, category: 'Tools', icon: 'bi-megaphone', priority: 'Medium', checked: false },
      { id: '8', name: 'Sanitizer/Soap', quantity: 2, category: 'Hygiene', icon: 'bi-hand-index-thumb', priority: 'Medium', checked: false }
    ];

    if (this.hasPets) {
      list.push({ id: 'p1', name: 'Pet Food', quantity: 2 * this.daysToLast, category: 'Pets', icon: 'bi-dog', priority: 'High', checked: false });
      list.push({ id: 'p2', name: 'Pet Water Bowl', quantity: 1, category: 'Pets', icon: 'bi-cup-hot', priority: 'Medium', checked: false });
    }

    if (this.hasMedicalNeeds) {
      list.push({ id: 'm1', name: 'Prescription Meds', quantity: 1, category: 'Medical', icon: 'bi-capsule', priority: 'High', checked: false });
      list.push({ id: 'm2', name: 'Medical Documents', quantity: 1, category: 'Medical', icon: 'bi-file-earmark-medical', priority: 'High', checked: false });
    }

    // Disaster-specific items
    if (this.selectedDisaster === 'Fire') {
      list.push({ id: 'f1', name: 'Smoke Mask', quantity: this.familySize, category: 'Tools', icon: 'bi-mask', priority: 'High', checked: false });
    } else if (this.selectedDisaster === 'Flood') {
      list.push({ id: 'fl1', name: 'Waterproof Bag', quantity: 2, category: 'Tools', icon: 'bi-bag', priority: 'Medium', checked: false });
    }

    this.customChecklist = list;
  }

  getPreparednessScore(): number {
    if (this.customChecklist.length === 0) return 0;
    const checked = this.customChecklist.filter(i => i.checked).length;
    return Math.round((checked / this.customChecklist.length) * 100);
  }

  toggleItem(id: string) {
    const item = this.customChecklist.find(i => i.id === id);
    if (item) item.checked = !item.checked;
  }

  onFinalizeManifest() {
    this.manifestFinalized.set(true);

  }

  resetManifest() {
    this.manifestFinalized.set(false);
  }
}



