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
import { FavouriteTrips } from 'src/app/models/favourite-trips.model';
import { TranslateService } from '@ngx-translate/core';

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
  error_message: string = "";
  success_message: string = "";
  sponsorshipNotCreated:boolean= true;

  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected userId!: string | null;
  currentDateTime: Date;

  priceIncreased: boolean = false;
  priceDecreased: boolean = false;

  constructor(private tripService: TripsService, private router:Router, private sponsorshipService: SponsorshipsService, private route: ActivatedRoute, private authService: AuthService, config: NgbCarouselConfig, private translate:TranslateService) {

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
      console.log("actor roles ", this.user.getRole());
    } else {
      this.activeRole = 'anonymous';
    }

    this.getTrip();

  }

  getPaidSponsorships() {
    console.log("SingleTripComponent->getPaidSponsorships this.trip.getTicker() ", this.trip.getTicker());
    this.sponsorshipService.getSponsorshipsByTrip(this.trip.getTicker())
      .subscribe(
        (response: any) => {
          console.log("SingleTripComponent->getPaidSponsorships response ", response);
          console.log("SingleTripComponent->getPaidSponsorships response.values ", response.sponsorships);
          if (response.error) {
            console.error(response.message);
            this.sponsorships_loaded = Promise.resolve(false);
          } else {
            this.sponsorships = response.sponsorships;
            console.log("SingleTripComponent->getPaidSponsorships this.sponsorships length ", this.sponsorships.length);

            this.paidSponsorships = this.sponsorships.filter(sponsorship => sponsorship.isPayed == true);
            console.log("SingleTripComponent->getPaidSponsorships this.paidSponsorships length ", this.paidSponsorships.length);
          }

          if (this.sponsorships.length > 0) {
            console.log("SingleTripComponent->getPaidSponsorships Promise.resolve ", true);
            this.selectRandomPaidSponsorship();
          }
          else {
            console.log("SingleTripComponent->getPaidSponsorships Promise.resolve ", false);
            this.sponsorships_loaded = Promise.resolve(false);
          }

        },
        (error) => {
          console.error("SingleTripComponent->getPaidSponsorships error", error);
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

        this.sponsorship.setBanner(this.sponsorship.getBanner());

        console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship ", this.sponsorship);
        console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship.getBanner() ", this.sponsorship.getBanner());
        console.log("SingleTripComponent->constructor selectRandomPaidSponsorship this.sponsorship.getPage() ", this.sponsorship.getPage());
      }

      this.sponsorships_loaded = Promise.resolve(true);
    } else {
      this.sponsorships_loaded = Promise.resolve(false);
    }
  }

  getDiffDays(start: string, now: string) {
    var startDate = new Date(start);
    var endDate = new Date(now);

    var difference = startDate.getTime() - endDate.getTime();
    return difference / (1000 * 3600 * 24);
  }

  getNowAndStartDateDiffInDays(trip: Trip)
  {
    return this.getDiffDays(trip.getStartDate().toString(), this.currentDateTime.toISOString());
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

        this.verifyPriceTracker(this.trip);
      })
      .catch((error) => {
        this.sponsorships = [];
        this.sponsorships_loaded = Promise.resolve(false);
        console.error("SingleTripComponent->constructor tripsService.getSingleTrip catch ", error);

      });
  }

  deleteTrip(trip: Trip) {

    this.error_message = "";
    this.success_message = "";

    this.translate.get('trips.messages.delete-trip-confirmation')
    .subscribe((message: string) => {
      if (confirm(message)) 
      {

        this.tripService.deleteTrip(trip.id)
        .then((response) => {
  
          console.log("SingleTripComponent->deleteTrip tripsService.deleteTrip then response ", response);
          this.success_message = response.message;
  
        })
        .catch((error) => {
  
          console.error("SingleTripComponent->deleteTrip tripsService.deleteTrip catch ", error);
          this.error_message = error.error;
  
        });

      }
    });

  }

  cancelTrip(trip: Trip) {

    this.error_message = "";
    this.success_message = "";

    let diff_in_days = this.getNowAndStartDateDiffInDays(trip);
    console.log("diff_in_days ", diff_in_days);

    if(diff_in_days < 7)
    {
      this.translate.get('trips.messages.cancel-trip-denied')
      .subscribe((message: string) => {
        alert(message);
      });
    }
    else
    {
      this.translate.get('trips.messages.cancel-trip-confirmation')
      .subscribe((message1: string) => {
  
        if(confirm(message1))
        {
  
          this.translate.get('trips.messages.cancel-trip-reason-request')
          .subscribe((message2: string) => {
    
            let cancelReason = prompt(message2);
      
            if (cancelReason == null || cancelReason == "")
            {
              //User cancelled the prompt"
            }
            else
            {
      
              this.tripService.cancelTrip(trip.id, cancelReason)
              .then((response) => {
      
                console.log("SingleTripComponent->cancelTrip tripsService.cancelTrip then response ", response);
                this.success_message = response.message;
                this.getTrip();
      
              })
              .catch((error) => {
      
                console.error("SingleTripComponent->cancelTrip tripsService.cancelTrip catch ", error.error[0]);
                this.error_message = error.error[0];
      
              });
      
            }
  
          });
    
        }
  
      });
  
    }

  }

  publishTrip(trip: Trip) {

    this.error_message = "";
    this.success_message = "";

    this.translate.get('trips.messages.publish-trip-confirmation')
    .subscribe((message: string) => {

      if(confirm(message))
      {
  
        this.tripService.publishTrip(trip.id)
        .then((response) => {
  
          console.log("SingleTripComponent->publishTrip tripsService.publishTrip then response ", response);
          this.success_message = response.message;
          this.getTrip();
  
        })
        .catch((error) => {
  
          console.error("SingleTripComponent->publishTrip tripsService.publishTrip catch ", error);
          this.error_message = "Messages.something-went-wrong";
  
        });
  
      }

    });

  }

  onSponsorshipCreate(trip:Trip) {
    // console.log("onSponsorshipPay -> trip", trip)
    let currentActor = JSON.parse(localStorage.getItem("currentActor"));
    let currentActorId= currentActor._id;
    console.log(currentActorId)
    let ticker = trip.getTicker();
    localStorage.setItem("tripTicker",ticker)
    this.router.navigate(['/actor/' + currentActorId + '/sponsorships/add-sponsorship']);

    
  }

  verifyPriceTracker(trip: Trip)
  {
    let priceTrackerTrips = JSON.parse(localStorage.getItem("priceTrackerTrips"));
    if(priceTrackerTrips)
    {
      priceTrackerTrips = priceTrackerTrips.map((currentTrip) => {

        if(currentTrip.id == trip._id)
        {
          let history = currentTrip.history;
          let lastRecord = history.at(-1);

          let currentPrice = trip.getPrice();
          if(currentPrice != lastRecord.price)
          {
            history.push({
              "price": currentPrice,
              "date": (new Date()).getTime()
            });
          }
          console.log("history.length ", history.length);

          if(history.length >= 2)
          {
            lastRecord = history.at(-1);
            let secondLastRecord = history.at(-2);
  
            if(lastRecord.price > secondLastRecord.price)
            {
              this.priceIncreased = true;
            }
  
            if(lastRecord.price < secondLastRecord.price)
            {
              this.priceDecreased = true;
            }
          }

        }

        return currentTrip;
      });
      //console.log("priceTrackerTrips ", priceTrackerTrips);
      localStorage.setItem("priceTrackerTrips", JSON.stringify(priceTrackerTrips));
    }
  }

}
