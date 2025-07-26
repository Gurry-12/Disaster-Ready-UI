import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'analytics-heatmaps',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './analytics-heatmaps.html',
  styleUrls: ['./analytics-heatmaps.css']
})
export class AnalyticsHeatmaps {
  // Use exact string literal types
  barChartType: 'bar' = 'bar';
  pieChartType: 'pie' = 'pie';
  lineChartType: 'line' = 'line';

  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Disaster Frequency by Region' }
    }
  };

  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Disaster Type Distribution' }
    }
  };

  lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Disaster Trend Over Time' }
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'],
    datasets: [
      { label: 'Floods', data: [10, 20, 15, 30], backgroundColor: '#42A5F5' },
      { label: 'Fires', data: [5, 25, 10, 20], backgroundColor: '#EF5350' }
    ]
  };

  pieChartData: ChartData<'pie'> = {
    labels: ['Floods', 'Fires', 'Earthquakes'],
    datasets: [
      {
        label: 'Disaster Count',
        data: [120, 80, 40],
        backgroundColor: ['#42A5F5', '#EF5350', '#66BB6A']
      }
    ]
  };

  lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Incidents Reported',
        data: [5, 10, 8, 12],
        borderColor: '#42A5F5',
        fill: false
      }
    ]
  };
}
