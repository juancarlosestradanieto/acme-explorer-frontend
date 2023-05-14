import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrls: ['./price-tracker.component.scss']
})
export class PriceTrackerComponent implements OnInit {

  priceTrackerTrips;
  lineChartsData = {};

  lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  lineChartLegend = true;

  constructor(private datePipe: DatePipe) {


  }

  ngOnInit(): void {
    
    let priceTrackerTrips = JSON.parse(localStorage.getItem("priceTrackerTrips"));
    
    if(priceTrackerTrips)
    {
      this.priceTrackerTrips = priceTrackerTrips;
      this.prepareCharts();
    }
  }

  prepareCharts()
  {
    this.priceTrackerTrips.map((currentTrip) => {

      console.log("currentTrip ", currentTrip);

      let history = currentTrip.history;

      let labels = [];
      let data = [];
      history.map((record) => {

        let formattedDate = this.datePipe.transform(record.date, 'dd/MM/yyyy H:mm:s');

        labels.push(formattedDate);
        data.push(record.price);

      });

      let label = currentTrip.title;

      let lineChartData: ChartConfiguration<'line'>['data'] = {
        labels: labels,
        datasets: [
          {
            data: data,
            label: label,
            fill: true,
            tension: 0.5,
            borderColor: 'black',
            backgroundColor: 'rgba(255,0,0,0.3)'
          }
        ]
      };
      
      this.lineChartsData[currentTrip.id] = lineChartData;

    });

    //console.log("this.lineChartsData ", this.lineChartsData);
  }

}
