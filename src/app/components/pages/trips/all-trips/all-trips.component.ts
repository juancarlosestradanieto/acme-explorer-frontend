import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { TripsService } from 'src/app/services/trips.service';

@Component({
  selector: 'app-all-trips',
  templateUrl: './all-trips.component.html',
  styleUrls: ['./all-trips.component.scss']
})
export class AllTripsComponent implements OnInit {

  storeTheme:string = localStorage.getItem('theme-color')!;
  trips: Array<Trip> = [];

  constructor(tripsService: TripsService) {

    tripsService.getAllTrips()
    .then((response) => {

      console.log("AllTripsComponent->constructor tripsService.getAllTrips then response ", response);
      this.trips = response;

    })
    .catch((error) => {

      console.error("AllTripsComponent->constructor tripsService.getAllTrips catch ", error);

    });

  }

  ngOnInit(): void {
  }

}
