import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrls: ['./price-tracker.component.scss']
})
export class PriceTrackerComponent implements OnInit {

  priceTrackerTrips;
  constructor() { }

  ngOnInit(): void {

    this.priceTrackerTrips = JSON.parse(localStorage.getItem("priceTrackerTrips"));

  }

}
