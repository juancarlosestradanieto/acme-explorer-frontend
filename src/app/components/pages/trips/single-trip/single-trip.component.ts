import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Stage } from 'src/app/models/stage.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips.service';

@Component({
  selector: 'app-single-trip',
  templateUrl: './single-trip.component.html',
  styleUrls: ['./single-trip.component.css']
})
export class SingleTripComponent implements OnInit {
  trip!: Trip;
  trip_id!: string;

  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected userId!: string | null;
  currentDateTime: Date;

  constructor(private tripService: TripsService, private route:ActivatedRoute, private authService: AuthService) 
  { 
    this.trip_id = this.route.snapshot.params['id'];
    this.currentDateTime = new Date;
    console.log("this.trip_id ",this.trip_id);

    tripService.getSingleTrip(this.trip_id)
    .then((response) => {

      console.log("SingleTripComponent->constructor tripsService.getAllTrips then response ", response);
      let json_trip = response;
      let casted_trip: Trip = Trip.castJsonTrip(json_trip);
      this.trip = casted_trip;

    })
    .catch((error) => {

      console.error("SingleTripComponent->constructor tripsService.getAllTrips catch ", error);

    });
    
  }

  ngOnInit(): void {

    this.user = this.authService.getCurrentActor();
    if (this.user) {
      this.activeRole = this.user.role.toString();
    } else {
      this.activeRole = 'anonymous';
    }

  }

}
