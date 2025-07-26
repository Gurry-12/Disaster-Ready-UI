import { Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { environment } from '../../environments/environment';

interface DisasterMarker {
  position: google.maps.LatLngLiteral;
  type: string;
  label: string;
  options: google.maps.MarkerOptions; // Remove the optional marker (?) to make it required
}

@Component({
  selector: 'app-live-disaster-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './live-disaster-map.html',
  styleUrls: ['./live-disaster-map.css']
})
export class LiveDisasterMap implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  
  // Add a flag to track if the API is loaded
  apiLoaded: boolean = false;
  
  // Google Maps options
  center: google.maps.LatLngLiteral = { lat: 22.9734, lng: 78.6569 };
  zoom = 5;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 3,
    streetViewControl: true,
    mapTypeControl: true,
  };
  
  // Disaster data
  disasters: DisasterMarker[] = [
    {
      position: { lat: 28.6139, lng: 77.2090 }, 
      type: 'flood', 
      label: 'Flood in New Delhi',
      options: {} // Replace undefined with empty object
    },
    { 
      position: { lat: 19.0760, lng: 72.8777 }, 
      type: 'fire', 
      label: 'Fire in Mumbai',
      options: {} // Add options property
    },
    { 
      position: { lat: 26.9124, lng: 75.7873 }, 
      type: 'earthquake', 
      label: 'Earthquake in Jaipur',
      options: {} // Add options property
    },
    { 
      position: { lat: 13.0827, lng: 80.2707 }, 
      type: 'cyclone', 
      label: 'Cyclone in Chennai',
      options: {} // Add options property
    }
  ];
  
  // Marker options for different disaster types
  markerOptions = {
    flood: { icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
    fire: { icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' },
    earthquake: { icon: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png' },
    cyclone: { icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }
  };
  
  // Active info window content
  activeInfoContent = '';
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit(): void {
    // Load the Google Maps API dynamically
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleMapsAPI().then(() => {
        this.apiLoaded = true;
        // Prepare marker options
        this.disasters = this.disasters.map(disaster => ({
          ...disaster,
          options: this.markerOptions[disaster.type as keyof typeof this.markerOptions] || {}
        }));
      });
    }
  }
  
  private loadGoogleMapsAPI(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.mapApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve();
      };
      document.head.appendChild(script);
    });
  }
  
  // Update the method signature to accept a MapMarker
  openInfoWindow(marker: MapMarker | any, disaster: DisasterMarker): void {
    this.activeInfoContent = disaster.label;
    if (marker instanceof MapMarker) {
      this.infoWindow.open(marker);
    }
  }
  
  // Filter markers by type
  filterMarkers(type: string): void {
    this.disasters.forEach(disaster => {
      if (disaster.options) {
        disaster.options.visible = type === 'all' || disaster.type === type;
      }
    });
  }
}
