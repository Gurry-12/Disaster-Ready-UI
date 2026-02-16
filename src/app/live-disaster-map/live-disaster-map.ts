import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, inject, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as L from 'leaflet';
// Importing leaflet.heat to extend L immediately
import 'leaflet.heat';

import * as IncidentActions from '../store/incidents/incident.actions';
import { selectAllIncidents } from '../store/incidents/incident.selectors';
import { Incident } from '../store/models/incident.model';

interface DisasterMarker {
    id: string;
    position: { lat: number; lng: number };
    type: string;
    title: string;
    description: string;
    location: string;
    leafletMarker?: L.Marker;
}

import { LoggerService } from '../shared/services/logger.service';

@Component({
    selector: 'app-live-disaster-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './live-disaster-map.html',
    styleUrls: ['./live-disaster-map.css']
})
export class LiveDisasterMap implements OnInit, AfterViewInit, OnDestroy {
    private store = inject(Store);
    private logger = inject(LoggerService);
    private destroy$ = new Subject<void>();
    private platformId = inject(PLATFORM_ID);

    private map!: L.Map;
    private markerLayer = L.layerGroup();

    allDisasters: DisasterMarker[] = [];
    filteredDisasters: DisasterMarker[] = [];
    selectedDisaster: DisasterMarker | null = null;
    showHeatmap = false;
    private heatLayer: any;

    ngOnInit(): void {
        this.store.dispatch(IncidentActions.loadIncidents());
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            // Slight delay to ensure DOM is ready
            setTimeout(() => {
                this.initMap();
                this.subscribeToIncidents();
            }, 100);
        }
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initMap(): void {
        if (this.map) return; // Prevent multiple initializations

        this.map = L.map('map', {
            center: [20.5937, 78.9629], // India Center
            zoom: 5,
            zoomControl: false
        });

        // Dark Matter Tile Layer (Tactical Look)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(this.map);

        this.markerLayer.addTo(this.map);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    }

    private subscribeToIncidents(): void {
        this.store.select(selectAllIncidents)
            .pipe(takeUntil(this.destroy$))
            .subscribe(incidents => {
                this.processIncidents(incidents);
            });
    }

    private processIncidents(incidents: Incident[]): void {
        if (!this.map) return;

        this.markerLayer.clearLayers();

        this.allDisasters = incidents.map(incident => {
            const marker: DisasterMarker = {
                id: incident.id,
                position: {
                    lat: incident.location?.latitude || 0,
                    lng: incident.location?.longitude || 0
                },
                type: incident.type,
                title: incident.title || incident.type,
                description: incident.description,
                location: incident.location?.address || `${incident.location?.city || 'Unknown City'}, ${incident.location?.state || ''}`
            };

            // Create Tactical Leaflet Marker
            const lMarker = L.marker([marker.position.lat, marker.position.lng], {
                icon: this.createTacticalIcon(marker.type)
            });

            lMarker.on('click', () => {
                // Angular change detection manual trigger might be needed if zone issues occur,
                // but usually click handlers inside zone work fine. 
                // We just update the state.
                this.selectedDisaster = marker;
            });

            marker.leafletMarker = lMarker;
            lMarker.addTo(this.markerLayer);

            return marker;
        });

        this.filteredDisasters = [...this.allDisasters];
        this.updateHeatmap();
    }

    private updateHeatmap(): void {
        if (!this.map) return;

        // Leaflet.heat expects [lat, lng, intensity]
        const heatPoints = this.allDisasters.map(d => [d.position.lat, d.position.lng, 0.8]);

        if (this.heatLayer) {
            this.map.removeLayer(this.heatLayer);
        }

        // @ts-ignore
        if (typeof L.heatLayer === 'function') {
            // @ts-ignore
            this.heatLayer = L.heatLayer(heatPoints, {
                radius: 30,
                blur: 20,
                maxZoom: 10,
                gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
            });

            if (this.showHeatmap) {
                this.heatLayer.addTo(this.map);
            }
        }
    }

    toggleHeatmap(): void {
        this.showHeatmap = !this.showHeatmap;
        if (!this.map) return;

        if (this.showHeatmap) {
            if (this.heatLayer) this.heatLayer.addTo(this.map);
            this.map.removeLayer(this.markerLayer);
        } else {
            if (this.heatLayer) this.map.removeLayer(this.heatLayer);
            this.markerLayer.addTo(this.map);
        }
    }

    private createTacticalIcon(type: string): L.DivIcon {
        const colorMap: { [key: string]: string } = {
            'Flood': '#3b82f6',
            'Fire': '#ef4444',
            'Earthquake': '#f59e0b',
            'Cyclone': '#10b981'
        };

        const color = colorMap[type] || '#6366f1';

        return L.divIcon({
            className: 'tactical-marker',
            html: `
                <div style="position: relative; width: 40px; height: 40px;">
                    <div class="marker-pulse" style="background: ${color}; box-shadow: 0 0 15px ${color}"></div>
                    <div class="marker-core" style="background: ${color}"></div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
    }

    filterMarkers(type: string): void {
        if (!this.map) return;

        this.markerLayer.clearLayers();

        if (type === 'all') {
            this.filteredDisasters = [...this.allDisasters];
        } else {
            this.filteredDisasters = this.allDisasters.filter(d => d.type === type);
        }

        this.filteredDisasters.forEach(d => {
            if (d.leafletMarker) {
                d.leafletMarker.addTo(this.markerLayer);
            }
        });

        // Dynamic fit bounds
        if (this.filteredDisasters.length > 0) {
            try {
                const group = L.featureGroup(this.filteredDisasters.map(d => d.leafletMarker!).filter(m => !!m));
                this.map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 10 });
            } catch (e) {
                this.logger.warn('Error fitting bounds', e);
            }
        }
    }
}
