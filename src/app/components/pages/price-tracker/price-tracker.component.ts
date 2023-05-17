import { Component, OnInit } from '@angular/core';
import { trackTrip } from 'src/app/interfaces/trackTrip';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrls: ['./price-tracker.component.scss']
})
export class PriceTrackerComponent implements OnInit {


  tripTrackingList: trackTrip[];

  constructor() { }

  ngOnInit(): void {

    this.tripTrackingList = JSON.parse(localStorage.getItem("trackingTripsList"))

  }

}
