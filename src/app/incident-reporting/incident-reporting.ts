import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleMapsModule } from '@angular/google-maps';

// State & Models
import { Incident, IncidentType, IncidentSeverity, CreateIncidentDto } from '../store/models/incident.model';
import { createIncident, loadIncidents } from '../store/incidents/incident.actions';
import { selectAllIncidents, selectIncidentLoading, selectLastSyncTime } from '../store/incidents/incident.selectors';

import { LoggerService } from '../shared/services/logger.service';

@Component({
  selector: 'app-incident-reporting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './incident-reporting.html',
  styleUrls: ['./incident-reporting.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentReporting implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private logger = inject(LoggerService);

  // UI State
  incidentForm!: FormGroup;
  loading$: Observable<boolean> = this.store.select(selectIncidentLoading);
  recentIncidents$: Observable<Incident[]> = this.store.select(selectAllIncidents).pipe(
    map(incidents => incidents.slice(0, 5)) // Show only last 5
  );
  lastSync$: Observable<number | null> = this.store.select(selectLastSyncTime);

  // Geolocation State
  currentLocation: google.maps.LatLngLiteral | null = null;
  locationStatus: 'idle' | 'locating' | 'success' | 'error' = 'idle';
  locationErrorMsg = '';

  // Options for Selects
  incidentTypes = Object.values(IncidentType);
  severities = Object.values(IncidentSeverity);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.store.dispatch(loadIncidents());
    this.getCurrentLocation();
  }

  private initForm(): void {
    this.incidentForm = this.fb.group({
      type: [null, [Validators.required]],
      severity: [IncidentSeverity.MEDIUM, [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      latitude: [{ value: null, disabled: true }, [Validators.required]],
      longitude: [{ value: null, disabled: true }, [Validators.required]],
      affectedPopulation: [null, [Validators.min(0)]],
      tags: [''] // Comma separated tags
    });
  }

  getCurrentLocation(): void {
    this.locationStatus = 'locating';
    this.cdr.markForCheck();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            this.currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.incidentForm.patchValue({
              latitude: this.currentLocation.lat.toFixed(6),
              longitude: this.currentLocation.lng.toFixed(6)
            });
            this.locationStatus = 'success';
            this.cdr.markForCheck();
          });
        },
        (error) => {
          this.ngZone.run(() => {
            this.locationStatus = 'error';
            this.locationErrorMsg = this.getGeoErrorMsg(error);
            this.logger.error('Geolocation error', error);
            this.cdr.markForCheck();
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      this.locationStatus = 'error';
      this.locationErrorMsg = 'Geolocation is not supported by this browser.';
      this.cdr.markForCheck();
    }
  }

  private getGeoErrorMsg(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED: return 'User denied the request for Geolocation.';
      case error.POSITION_UNAVAILABLE: return 'Location information is unavailable.';
      case error.TIMEOUT: return 'The request to get user location timed out.';
      default: return 'An unknown error occurred.';
    }
  }

  onSubmit(): void {
    if (this.incidentForm.valid && this.currentLocation) {
      const formValue = this.incidentForm.getRawValue();

      const newIncident: CreateIncidentDto = {
        type: formValue.type,
        severity: formValue.severity,
        title: formValue.title,
        description: formValue.description,
        location: {
          latitude: this.currentLocation.lat,
          longitude: this.currentLocation.lng,
          accuracy: 10 // Mock accuracy, would come from Position object in real app
        },
        affectedPopulation: formValue.affectedPopulation,
        tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0) : [],
        estimatedDamage: 'Unknown'
      };

      this.store.dispatch(createIncident({ incident: newIncident }));

      // Reset form but preserve location and severity default
      this.incidentForm.reset({
        type: null,
        severity: IncidentSeverity.MEDIUM,
        title: '',
        description: '',
        tags: '',
        latitude: this.currentLocation.lat.toFixed(6),
        longitude: this.currentLocation.lng.toFixed(6)
      });

      this.incidentForm.markAsPristine();
      this.incidentForm.markAsUntouched();
    } else {
      this.incidentForm.markAllAsTouched();
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case IncidentSeverity.CRITICAL: return 'danger';
      case IncidentSeverity.HIGH: return 'warning';
      case IncidentSeverity.MEDIUM: return 'info';
      case IncidentSeverity.LOW: return 'secondary';
      default: return 'primary';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case IncidentType.FLOOD: return 'bi-tsunami';
      case IncidentType.FIRE: return 'bi-fire';
      case IncidentType.EARTHQUAKE: return 'bi-activity';
      case IncidentType.CYCLONE: return 'bi-cloud-lightning-rain';
      default: return 'bi-exclamation-triangle';
    }
  }
}
