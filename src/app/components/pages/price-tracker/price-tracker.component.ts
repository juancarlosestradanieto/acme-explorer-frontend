import { Component, OnInit } from '@angular/core';
import { tripTrack } from 'src/app/interface/tripTrack';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrls: ['./price-tracker.component.scss']
})
export class PriceTrackerComponent implements OnInit {

  trackingTrips:tripTrack[];
  constructor() { }

  ngOnInit(): void {
    this.displayTrackingtrips();
  }

  displayTrackingtrips(){
    this.trackingTrips = JSON.parse(localStorage.getItem("TrackedTripsList"))
  }


}
