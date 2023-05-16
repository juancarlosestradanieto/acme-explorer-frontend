import { Component, OnInit } from '@angular/core';
import { TrackingTrip } from 'src/app/interface/trackingTripList';
import { Trip } from 'src/app/models/trip.model';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrls: ['./price-tracker.component.scss']
})
export class PriceTrackerComponent implements OnInit {

  trackingTrips:TrackingTrip[]= []

  constructor() { }

  ngOnInit(): void {
    this.displayTrips()
  }

  displayTrips(){
    let parsedTripsList = JSON.parse(localStorage.getItem("TrackingTripsList"));
    console.log(parsedTripsList)

    if(parsedTripsList){
      this.trackingTrips = parsedTripsList;
    }
  }


}
