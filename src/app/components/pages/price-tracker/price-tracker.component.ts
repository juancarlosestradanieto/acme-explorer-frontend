import { Component, OnInit } from '@angular/core';
import { tripTrack } from 'src/app/interface/tripTrack';
import 'chart.js';
import { ChartOptions } from 'chart.js';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrls: ['./price-tracker.component.scss']
})
export class PriceTrackerComponent implements OnInit {

  trackingTrips:tripTrack[];
  chart: Chart;
  chartData: any;

  constructor() { }

  ngOnInit(): void {
    
    this.displayTrackingtrips();
    
      console.log(this.trackingTrips)
      this.chartData = this.convertDataForChart(this.trackingTrips);
      this.createChart();
    

  }

  displayTrackingtrips(){
    this.trackingTrips = JSON.parse(localStorage.getItem("TrackedTripsList"));

  }

  convertDataForChart(data: tripTrack[]): any[] {
    return data.map(trackingTrip => ({
      label: trackingTrip.title,
      data: trackingTrip.price
    }));
  }

  createChart() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    const labels = this.chartData.map(data => data.label);
    const values = this.chartData.map(data => data.data);
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Precios de viajes',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
