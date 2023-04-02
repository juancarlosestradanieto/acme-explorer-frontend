import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actor } from 'src/app/models/actor.model';
import { Application } from 'src/app/models/application.model';
import { Trip } from 'src/app/models/trip.model';
import { ApplicationsService } from 'src/app/services/applications.service';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips.service';

@Component({
  selector: 'app-all-trips',
  templateUrl: './all-trips.component.html',
  styleUrls: ['./all-trips.component.css']
})
export class AllTripsComponent implements OnInit {

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
      this.trips = response.docs;
      this.trips = response.docs as Array<Trip>;

      /*
      let pictures: Array<string> = ["uno", "dos"];
      let test_trip = this.trips[0];
      console.log("test_trip", test_trip);
      
      test_trip.setPictures(pictures);
      this.trips.push(test_trip);
      */
      //console.log(this.getDiffDays(this.trips[0].start_date.toString(), this.currentDateTime.toISOString()))
    })
    .catch((error) => {

        console.error("AllTripsComponent->constructor tripsService.getAllTrips catch ", error);

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
  
  getDiffDays(start: string, now: string) {
    var startDate = new Date(start);
    var endDate = new Date(now);
  
    var difference = startDate.getTime() - endDate.getTime();
    return difference / (1000 * 3600 * 24);
  }

  getCurrentStyles(start: string, now: string) {
    let difference = this.getDiffDays(start, now);
    console.log(difference);
    let soon = difference > 0 && difference <= 7;
    console.log(soon);
    let currenStyles = {
      'font-weight': soon ? 'bold' : '',
      'font-size': soon ? '115%' : '',
      'background-color': soon ? 'indianred' : ''
    };

    return currenStyles;
  }

}
