import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resource-overview',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './resource-overview.html',
  styleUrl: './resource-overview.css'
})
export class ResourceOverview {
resources = [
    { type: 'Water', status: 'Available', quantity: 500 },
    { type: 'Food', status: 'Deployed', quantity: 200 },
    { type: 'Medical Kits', status: 'Available', quantity: 120 },
    { type: 'Blankets', status: 'In Transit', quantity: 300 },
    { type: 'Generators', status: 'Deployed', quantity: 15 }
  ];
}
