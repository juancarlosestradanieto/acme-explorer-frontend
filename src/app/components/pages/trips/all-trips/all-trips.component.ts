import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { TripsService } from 'src/app/services/trips.service';

@Component({
  selector: 'app-all-trips',
  templateUrl: './all-trips.component.html',
  styleUrls: ['./all-trips.component.css']
})
export class AllTripsComponent implements OnInit {

  trips: Array<Trip> = [];

  constructor(tripsService: TripsService) {

    tripsService.getAllTrips()
    .then((response) => {

      console.log("AllTripsComponent->constructor tripsService.getAllTrips then response ", response);
      this.trips = response.docs;
      this.trips = response.docs as Array<Trip>;

      /*
      let pictures: Array<string> = ["uno", "dos"];
      let test_trip = this.trips[0];
      console.log("test_trip", test_trip);
      
      test_trip.setPictures(pictures);
      this.trips.push(test_trip);
      */
    })
    .catch((error) => {

      console.error("AllTripsComponent->constructor tripsService.getAllTrips catch ", error);

    });

  }

  ngOnInit(): void {
  }

}
