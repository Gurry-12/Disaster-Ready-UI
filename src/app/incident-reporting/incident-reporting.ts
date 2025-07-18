import { Component } from '@angular/core';
import { IncidentService } from '../incident.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-incident-reporting',
  imports: [FormsModule],
  templateUrl: './incident-reporting.html',
  styleUrl: './incident-reporting.css',
  providers: []
})
export class IncidentReporting {
  type = '';
  location = '';
  description = '';
  imageUrl = '';

  constructor(private incidentService: IncidentService) {}

  onSubmit() {
    if (!this.type || !this.location || !this.description) return;
    this.incidentService.addIncident({
      type: this.type,
      location: this.location,
      description: this.description,
      imageUrl: this.imageUrl || undefined
    });
    this.type = '';
    this.location = '';
    this.description = '';
    this.imageUrl = '';
    alert('Incident reported!');
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
