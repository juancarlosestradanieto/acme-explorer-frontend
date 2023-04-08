import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actor } from 'src/app/models/actor.model';
import { Application } from 'src/app/models/application.model';
import { Trip } from 'src/app/models/trip.model';
import { ApplicationsService } from 'src/app/services/applications.service';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips/trips.service';

@Component({
  selector: 'app-all-trips',
  templateUrl: './all-trips.component.html',
  styleUrls: ['./all-trips.component.scss']
})
export class AllTripsComponent implements OnInit {

  storeTheme:string = localStorage.getItem('theme-color')!;
  trips: Array<Trip> = [];
  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected userId!: string | null;
  currentDateTime: Date;

  constructor(tripsService: TripsService, private authService: AuthService) {

    this.currentDateTime = new Date;

    tripsService.getAllTrips()
      .then((response) => {

      console.log("AllTripsComponent->constructor tripsService.getAllTrips then response ", response);
      let json_trips = response.docs;
      let casted_trips = Trip.castJsonTrips(json_trips);
      // console.log("casted_trips ", casted_trips);
      this.trips = casted_trips;
      
      //console.log(this.getDiffDays(this.trips[0].start_date.toString(), this.currentDateTime.toISOString()))
    })
    .catch((error) => {

        console.error("AllTripsComponent->constructor tripsService.getAllTrips catch ", error);

      });

  }

  ngOnInit(): void {

    this.user = this.authService.getCurrentActor();
    if (this.user) {
      this.activeRole = this.user.getRole().toString();
    } else {
      this.activeRole = 'anonymous';
    }

  }
  
  getDiffDays(start: string, now: string) {
    var startDate = new Date(start);
    var endDate = new Date(now);
  
    var difference = startDate.getTime() - endDate.getTime();
    return difference / (1000 * 3600 * 24);
  }

  getCurrentStyles(start: string, now: string) {
    let difference = this.getDiffDays(start, now);
    //console.log(difference);
    let soon = difference > 0 && difference <= 7;
    //console.log(soon);
    let currenStyles = {
      'font-weight': soon ? 'bold' : '',
      'font-size': soon ? '115%' : '',
      'background-color': soon ? 'indianred' : ''
    };

    return currenStyles;
  }

  deleteTrip(trip: Trip)
  {
    console.log("deleteTrip", trip.id);
    
  }

}
