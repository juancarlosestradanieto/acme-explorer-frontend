import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Stage } from 'src/app/models/stage.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips/trips.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-single-trip',
  templateUrl: './single-trip.component.html',
  styleUrls: ['./single-trip.component.scss'],
  providers: [NgbCarouselConfig]
})
export class SingleTripComponent implements OnInit {
  trip!: Trip;
  trip_id!: string;
  json_trip: any;

  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected userId!: string | null;
  currentDateTime: Date;

  constructor(private tripService: TripsService, private route:ActivatedRoute, private authService: AuthService, config: NgbCarouselConfig) 
  { 
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;

    this.trip_id = this.route.snapshot.params['id'];
    this.currentDateTime = new Date;
    console.log("this.trip_id ",this.trip_id);
  }

  ngOnInit(): void {

    this.user = this.authService.getCurrentActor();
    if (this.user) {
      this.activeRole = this.user.getRole().toString();
    } else {
      this.activeRole = 'anonymous';
    }

    this.getTrip();

  }

  getTrip()
  {
    this.tripService.getSingleTrip(this.trip_id)
    .then((response) => {

      console.log("SingleTripComponent->constructor tripsService.getSingleTrip then response ", response);
      this.json_trip = response;
      console.log("this.json_trip", this.json_trip);
      
      let casted_trip: Trip = Trip.castJsonTrip(this.json_trip);
      this.trip = casted_trip;

    })
    .catch((error) => {

      console.error("SingleTripComponent->constructor tripsService.getSingleTrip catch ", error);

    });
  }

  favouriteTrip(trip: Trip) {
    console.log("favouriteTrip user.email ", this.user!.getEmail());
    console.log("favouriteTrip user.email-favourites ", this.user!.getEmail() + "-favourites");
    let favourites = localStorage.getItem(this.user!.getEmail() + "-favourites");
    console.log("favouriteTrip " + this.user!.getEmail() + "-favourites ", favourites);
    if (!favourites) {
      let newFavourites = [];
      newFavourites.push(trip);
      console.log("favouriteTrip newFavourites ", newFavourites);
      localStorage.setItem(this.user!.getEmail() + "-favourites", JSON.stringify(newFavourites));
    }
    else {
      let storedFavourites: Trip[] = JSON.parse(localStorage.getItem(this.user!.getEmail() + "-favourites") || '{}');
      let existsInFavourites: boolean = storedFavourites.some(storedTrip => Trip.castJsonTrip(storedTrip).getTicker() === trip.getTicker());
      console.log("favouriteTrip trip is in storedFavourites ", existsInFavourites);
      if (existsInFavourites) {
        storedFavourites.forEach((storedTrip, index) => {
          if (Trip.castJsonTrip(storedTrip).getTicker() === trip.getTicker()) {
            storedFavourites.splice(index, 1);
          }
        });
        console.log("favouriteTrip storedFavourites ", storedFavourites);
        localStorage.setItem(this.user!.getEmail() + "-favourites", JSON.stringify(storedFavourites));
      } else {
        console.log("favouriteTrip storedFavourites ", storedFavourites);
        storedFavourites.push(trip);
        localStorage.setItem(this.user!.getEmail() + "-favourites", JSON.stringify(storedFavourites));
      }
    }
  }

  checkTripInFavourites(trip: Trip) {
    let result: boolean = false;
    console.log("favouriteTrip user.email ", this.user!.getEmail());
    console.log("favouriteTrip user.email-favourites ", this.user!.getEmail() + "-favourites");
    let favourites = localStorage.getItem(this.user!.getEmail() + "-favourites");
    console.log("favouriteTrip " + this.user!.getEmail() + "-favourites ", favourites);
    if (favourites) {
      let storedFavourites: Trip[] = JSON.parse(localStorage.getItem(this.user!.getEmail() + "-favourites") || '{}');
      let existsInFavourites: boolean = storedFavourites.some(storedTrip => Trip.castJsonTrip(storedTrip).getTicker() === trip.getTicker());
      console.log("favouriteTrip trip is in storedFavourites ", existsInFavourites);
      if (existsInFavourites) {
        result = true;
      }
    }
    return result;
  }

}
