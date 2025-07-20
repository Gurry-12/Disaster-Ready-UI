import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-analytics-heatmaps',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './analytics-heatmaps.html',
  styleUrls: ['./analytics-heatmaps.css']
})
export class AnalyticsHeatmaps {
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Incidents by Type' }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['Flood', 'Fire', 'Earthquake', 'Storm', 'Landslide', 'Cyclone'],
    datasets: [
      {
        data: [5, 3, 2, 4, 1, 2],
        label: 'Incidents',
        backgroundColor: ['#2563eb', '#f59e42', '#dc2626', '#22c55e', '#a855f7', '#f43f5e']
      }
    ]
  };
  public barChartType: ChartType = 'bar';
}
