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

  constructor(tripsService: TripsService, private applicationService: ApplicationsService, private authService: AuthService) {

    tripsService.getAllTrips()
      .then((response) => {

        console.log("AllTripsComponent->constructor tripsService.getAllTrips then response ", response);
        this.trips = response;

      })
      .catch((error) => {

        console.error("AllTripsComponent->constructor tripsService.getAllTrips catch ", error);

      });

  }

  createApplications(trip_id: string) {
    let application = new Application();
    this.applicationService.createApplication(application, trip_id, this.user!.id)
    .then((response) => {
      console.log("AllTripsComponent->createApplications then response ", response);
    })
    .catch((error) => {
      console.error("AllTripsComponent->createApplications error ", error);
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
