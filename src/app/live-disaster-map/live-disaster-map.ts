import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-live-disaster-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-disaster-map.html',
  styleUrls: ['./live-disaster-map.css']
})
export class LiveDisasterMap implements AfterViewInit {
  private map: L.Map | undefined;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([28.6139, 77.2090], 5); // Centered on India
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '\u00a9 OpenStreetMap contributors'
    }).addTo(this.map);
    L.marker([28.6139, 77.2090]).addTo(this.map)
      .bindPopup('Demo Incident: New Delhi')
      .openPopup();
  }
}
