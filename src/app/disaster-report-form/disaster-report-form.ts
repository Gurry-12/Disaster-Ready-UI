import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-disaster-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './disaster-report-form.html',
  styleUrl: './disaster-report-form.css'
})
export class DisasterReportForm {
  private fb = inject(FormBuilder);

  isSubmitting = false;
  submitted = false;

  reportForm = this.fb.group({
    incidentType: ['', Validators.required],
    severity: ['medium', Validators.required],
    location: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    contactPhone: ['', Validators.required]
  });

  categories = [
    { id: 'flood', label: 'Flash Flood', icon: 'bi-water' },
    { id: 'fire', label: 'Wildfire', icon: 'bi-fire' },
    { id: 'structural', label: 'Structural Failure', icon: 'bi-building-exclamation' },
    { id: 'medical', label: 'Mass Casualty', icon: 'bi-heart-pulse' },
    { id: 'utility', label: 'Grid Outage', icon: 'bi-lightning-charge' },
    { id: 'other', label: 'Other Hazard', icon: 'bi-question-circle' }
  ];

  selectCategory(id: string) {
    this.reportForm.patchValue({ incidentType: id });
  }

  submitReport() {
    if (this.reportForm.valid) {
      this.isSubmitting = true;
      // Simulate API latency
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitted = true;

      }, 1500);
    }
  }

  resetForm() {
    this.reportForm.reset({ severity: 'medium' });
    this.submitted = false;
  }
}

