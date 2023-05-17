import { Component, OnInit } from '@angular/core';
import { trackTrip } from 'src/app/interfaces/trackTrip';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrls: ['./price-tracker.component.scss']
})
export class PriceTrackerComponent implements OnInit {


  tripTrackingList: trackTrip[];
  chart: Chart;
  chartData: any;
  
  constructor() { }

  ngOnInit(): void {

    this.tripTrackingList = JSON.parse(localStorage.getItem("trackingTripsList"))
    console.log(this.tripTrackingList)
    this.chartData = this.convertDataForChart(this.tripTrackingList);
    this.createChart();
  }

  convertDataForChart(data: trackTrip[]): any[] {
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




  

  




