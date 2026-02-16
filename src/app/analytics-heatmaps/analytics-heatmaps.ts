import { Component, OnInit, OnDestroy, inject, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { LoggerService } from '../shared/services/logger.service';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import * as IncidentActions from '../store/incidents/incident.actions';
import { selectAllIncidents } from '../store/incidents/incident.selectors';
import { Incident } from '../store/models/incident.model';

// Register components once
Chart.register(...registerables, MatrixController, MatrixElement);

@Component({
  selector: 'analytics-heatmaps',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analytics-heatmaps.html',
  styleUrls: ['./analytics-heatmaps.css']
})
export class AnalyticsHeatmaps implements OnInit, OnDestroy {
  private store = inject(Store);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private logger = inject(LoggerService);
  private destroy$ = new Subject<void>();

  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;

  // Use exact string literal types
  barChartType: 'bar' = 'bar';
  pieChartType: 'pie' = 'pie';
  lineChartType: 'line' = 'line';
  heatmapChartType: 'matrix' = 'matrix';

  // Heatmap Configuration


  // Correctly type the options as any to avoid strict type checks on custom properties like 'width'
  heatmapChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Incident Density (Day vs Hour)' },
      tooltip: {
        callbacks: {
          title() { return ''; },
          label(context: any) {
            const v = context.raw;
            return `${v.d} ${v.h}h: ${v.v} incidents`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        labels: ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
          '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
        grid: { display: false },
        ticks: { autoSkip: false, maxRotation: 90, minRotation: 90 }
      },
      y: {
        type: 'category',
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        grid: { display: false },
        offset: true
      }
    }
  };

  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Ensure it fills container
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: 'Disaster Trends (2024)' }
    }
  };

  pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Severity Distribution (Live)' }
    }
  };

  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 } // Smooth curves
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: 'Monthly Analysis' }
    }
  };

  // Initial Empty Data
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  heatmapChartData: ChartData<'matrix'> = { datasets: [] };

  ngOnInit() {
    this.store.dispatch(IncidentActions.loadIncidents());

    // Generate Heatmap Mock Data immediately
    this.generateHeatmapData();

    // 1. Subscribe to Real-Time Incidents
    this.store.select(selectAllIncidents)
      .pipe(takeUntil(this.destroy$))
      .subscribe(incidents => {
        this.updateRealTimeCharts(incidents);
      });

    // 2. Load Historical Data (Mock)
    this.http.get<any[]>('/assets/data/mock-analytics-history.json')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (historicalData) => {
          this.updateHistoricalCharts(historicalData);
        },
        error: (err) => this.logger.error('Failed to load analytics history', err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private generateHeatmapData() {
    // Mock Data: 7 Days x 24 Hours
    const data: any[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        // Base noise
        let value = Math.floor(Math.random() * 8);

        // Daily Cycles (Morning 8-10, Evening 18-21)
        if ((h >= 8 && h <= 10) || (h >= 18 && h <= 21)) {
          value += Math.floor(Math.random() * 25) + 10;
        }

        // Specific Hotspots (e.g., Wednesday afternoon spike, Friday night spike)
        if (d === 3 && h >= 13 && h <= 15) value += 30;
        if (d === 5 && h >= 22) value += 20;

        // Weekend base increase
        if (d === 0 || d === 6) value += 5;

        data.push({
          x: this.heatmapChartOptions.scales?.x?.labels?.[h] as string,
          y: this.heatmapChartOptions.scales?.y?.labels?.[d] as string,
          d: days[d],
          h: h,
          v: value
        });
      }
    }

    this.heatmapChartData = {
      datasets: [{
        label: 'Incident Density',
        data: data,
        backgroundColor(c: any) {
          const value = c.raw?.v || 0;
          // Normalized alpha based on intensity
          const alpha = Math.min(value / 50, 1);
          return `rgba(239, 68, 68, ${alpha})`;
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderRadius: 4,
        width: ({ chart }: any) => {
          const area = chart.chartArea || { width: 1000 };
          return area.width / 24 - 4;
        },
        height: ({ chart }: any) => {
          const area = chart.chartArea || { height: 500 };
          return area.height / 7 - 4;
        }
      }]
    };
  }

  private updateRealTimeCharts(incidents: Incident[]) {
    // Pie Chart: By Severity (Live Data)
    const severityCounts: Record<string, number> = {};
    incidents.forEach(i => severityCounts[i.severity] = (severityCounts[i.severity] || 0) + 1);

    this.pieChartData = {
      labels: Object.keys(severityCounts).map(s => s.toUpperCase()),
      datasets: [{
        data: Object.values(severityCounts),
        backgroundColor: ['#66BB6A', '#FFCA28', '#EF5350', '#880E4F'],
        hoverOffset: 4
      }]
    };

    this.refreshCharts();
  }

  private updateHistoricalCharts(data: any[]) {
    // Bar & Line Charts: Uses Mock Historical Data
    const labels = data.map(d => d.month);

    // Bar Chart: Type Distribution per Month
    this.barChartData = {
      labels,
      datasets: [
        { data: data.map(d => d.flood), label: 'Floods', backgroundColor: '#42A5F5' },
        { data: data.map(d => d.fire), label: 'Fires', backgroundColor: '#EF5350' },
        { data: data.map(d => d.cyclone), label: 'Cyclones', backgroundColor: '#FFA726' }
      ]
    };

    // Line Chart: Total Incidents Trend
    this.lineChartData = {
      labels,
      datasets: [{
        data: data.map(d => d.flood + d.fire + d.cyclone + d.earthquake),
        label: 'Total Incidents',
        borderColor: '#AB47BC',
        backgroundColor: 'rgba(171, 71, 188, 0.1)',
        fill: true,
        pointBackgroundColor: '#AB47BC',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#AB47BC',
        tension: 0.4
      }]
    };

    this.refreshCharts();
  }

  private refreshCharts() {
    // Manually trigger change detection and chart updates
    this.cdr.markForCheck();
    if (this.charts) {
      this.charts.forEach(c => c.update());
    }
  }
}
