import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { TripsService } from 'src/app/services/trips.service';

@Component({
  selector: 'app-single-trip',
  templateUrl: './single-trip.component.html',
  styleUrls: ['./single-trip.component.css']
})
export class SingleTripComponent implements OnInit {
  trip!: Trip;
  trip_id!: string;

  constructor(private tripService: TripsService, private route:ActivatedRoute) 
  { 
    this.trip_id = this.route.snapshot.params['id'];
    console.log("this.trip_id ",this.trip_id);

    tripService.getSingleTrip(this.trip_id)
    .then((response) => {

      console.log("SingleTripComponent->constructor tripsService.getAllTrips then response ", response);
      this.trip = response;

    })
    .catch((error) => {

      console.error("SingleTripComponent->constructor tripsService.getAllTrips catch ", error);

    });
    
  }

  ngOnInit(): void {
  }

}
