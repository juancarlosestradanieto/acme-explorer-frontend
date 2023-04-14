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
  paidSponsorships!: Sponsorship[];
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
            this.sponsorships_loaded = Promise.resolve(false);
          } else {
            this.sponsorships = Sponsorship.castJsonSponsorships(response.sponsorships);
            console.log("SingleTripComponent->constructor this.sponsorships length ", this.sponsorships.length);

            this.paidSponsorships = this.sponsorships.filter(sponsorship => sponsorship.getIsPayed() == true);
            console.log("SingleTripComponent->constructor this.paidSponsorships length ", this.paidSponsorships.length);
          }

          if (this.sponsorships.length > 0) {
            console.log("SingleTripComponent->constructor getSponsorships Promise.resolve ", true);
            this.selectRandomPaidSponsorship();
          }
          else {
            console.log("SingleTripComponent->constructor getSponsorships Promise.resolve ", false);
            this.sponsorships_loaded = Promise.resolve(false);
          }

        }
      );
  }

  selectRandomPaidSponsorship() {
    if(this.paidSponsorships.length > 0) {
      const randomSponsorshipIndex = Math.floor(Math.random() * this.paidSponsorships.length);
      console.log("SingleTripComponent->constructor selectRandomPaidSponsorship randomSponsorshipIndex ", randomSponsorshipIndex);
  
      this.sponsorship = new Sponsorship(this.paidSponsorships[randomSponsorshipIndex]);
  
      console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship ", this.sponsorship);
      console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship.getBanner() ", this.sponsorship.getBanner());
      console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship.getPage() ", this.sponsorship.getPage());
  
      console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship.getBanner().length ", this.sponsorship.banner.length);
    
      if(this.sponsorship.getBanner().length > 1) {
        const randomBannerIndex = Math.floor(Math.random() * this.sponsorship.getBanner().length);
        console.log("SingleTripComponent->constructor selectRandomPaidSponsorship randomBannerIndex ", randomBannerIndex);
  
        this.sponsorship.setBanner([this.sponsorship.getBanner()[randomBannerIndex]]);
  
        console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship ", this.sponsorship);
        console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship.getBanner() ", this.sponsorship.getBanner());
        console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship.getPage() ", this.sponsorship.getPage());
      }
  
      this.sponsorships_loaded = Promise.resolve(true);
    } else {
      this.sponsorships_loaded = Promise.resolve(false);
    }
  }

}
