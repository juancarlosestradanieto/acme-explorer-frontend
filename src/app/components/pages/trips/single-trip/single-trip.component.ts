import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Stage } from 'src/app/models/stage.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips/trips.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Sponsorship } from 'src/app/models/sponsorship.model';
import { SponsorshipsService } from 'src/app/services/sponsorships.service';
import { SponsorshipsResponse } from 'src/app/models/sponsorships-response.model';

@Component({
  selector: 'app-single-trip',
  templateUrl: './single-trip.component.html',
  styleUrls: ['./single-trip.component.scss'],
  providers: [NgbCarouselConfig]
})
export class SingleTripComponent implements OnInit {
  trip!: Trip;
  trip_id!: string;
  sponsorships!: Sponsorship[];
  sponsorships_loaded!: Promise<boolean>;
  sponsorship!: Sponsorship;
  json_trip: any;

  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected userId!: string | null;
  currentDateTime: Date;

  constructor(private tripService: TripsService, private sponsorshipService: SponsorshipsService, private route: ActivatedRoute, private authService: AuthService, config: NgbCarouselConfig) {
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;

    this.trip_id = this.route.snapshot.params['id'];
    this.currentDateTime = new Date;
    console.log("this.trip_id ", this.trip_id);
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

  getTrip() {
    this.tripService.getSingleTrip(this.trip_id)
      .then((response) => {

        console.log("SingleTripComponent->constructor tripsService.getSingleTrip then response ", response);
        this.json_trip = response;
        console.log("this.json_trip", this.json_trip);

        let casted_trip: Trip = Trip.castJsonTrip(this.json_trip);
        this.trip = casted_trip;

        this.getPaidSponsorships();
      })
      .catch((error) => {
        this.sponsorships = [];
        this.sponsorships_loaded = Promise.resolve(false);
        console.error("SingleTripComponent->constructor tripsService.getSingleTrip catch ", error);

      });
  }

  getPaidSponsorships() {
    console.log("SingleTripComponent->constructor getSponsorships this.trip.getTicker() ", this.trip.getTicker());
    this.sponsorshipService.getSponsorshipsByTrip(this.trip.getTicker())
      .subscribe(
        (response: any) => {
          console.log("SingleTripComponent->constructor getSponsorships response ", response);
          console.log("SingleTripComponent->constructor getSponsorships response.values ", response.sponsorships);
          if (response.error) {
            console.error(response.message);
          } else {
            this.sponsorships = response.sponsorships;
            console.log("SingleTripComponent->constructor getSponsorships length ", this.sponsorships.length);
          }

          if (this.sponsorships.length > 0) {
            console.log("SingleTripComponent->constructor getSponsorships Promise.resolve ", true);
            this.selectRandomPaidSponsorship();
            this.sponsorships_loaded = Promise.resolve(true);
          }
          else {
            console.log("SingleTripComponent->constructor getSponsorships Promise.resolve ", false);
            this.sponsorships_loaded = Promise.resolve(false);
          }

        }
      );
  }

  selectRandomPaidSponsorship() {
    const randomIndex = Math.floor(Math.random() * this.sponsorships.length);
    console.log("SingleTripComponent->constructor selectRandomPaidSponsorship randomIndex ", randomIndex);

    this.sponsorship = new Sponsorship(this.sponsorships[randomIndex]);

    console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship ", this.sponsorship);
    console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship.getBanner() ", this.sponsorship.getBanner());
    console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship.getPage() ", this.sponsorship.getPage());
  }

}
