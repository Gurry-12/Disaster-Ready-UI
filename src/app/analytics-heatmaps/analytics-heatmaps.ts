import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-analytics-heatmaps',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analytics-heatmaps.html',
  styleUrl: './analytics-heatmaps.css'
})
export class AnalyticsHeatmaps {
  // Static bar chart data
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Incidents by Type' }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['Flood', 'Fire', 'Earthquake', 'Storm'],
    datasets: [
      {
        data: [5, 3, 2, 4],
        label: 'Incidents',
        backgroundColor: ['#2563eb', '#f59e42', '#dc2626', '#22c55e']
      }
    ]
  };
  public barChartType: ChartType = 'bar';
}
