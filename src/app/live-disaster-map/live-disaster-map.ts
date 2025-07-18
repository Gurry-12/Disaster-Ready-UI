import { Component, OnInit } from '@angular/core';
import { Incident, IncidentService } from '../incident.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-disaster-map',
  imports: [CommonModule],
  templateUrl: './live-disaster-map.html',
  styleUrl: './live-disaster-map.css',
  providers: []
})
export class LiveDisasterMap implements OnInit {
  incidents: Incident[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit() {
    this.incidentService.getIncidents().subscribe(data => {
      this.incidents = data;
    });
  }
}
