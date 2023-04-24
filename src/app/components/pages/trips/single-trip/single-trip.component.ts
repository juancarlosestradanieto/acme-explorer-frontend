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
      console.log("actor roles ", this.user.getRole());
      this.tripService.getFavouriteTripsByReference(this.user!.getEmail() + "-favourites")
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            console.log("SingleTripComponent->getFavouriteTripsByReference response ", response[0]);
            let favourites = new FavouriteTrips(response[0]);
            console.log("SingleTripComponent->getFavouriteTripsByReference object ", favourites);
            console.log("SingleTripComponent->getFavouriteTripsByReference reference ", favourites.getReference());
            console.log("SingleTripComponent->getFavouriteTripsByReference trips ", favourites.getTrips());
            localStorage.setItem(favourites.getReference(), JSON.stringify(favourites.getTrips()));
          }
          else {
            console.log("SingleTripComponent->getFavouriteTripsByReference response is empty");
          }
        },
        (error) => {
          console.error("SingleTripComponent->getFavouriteTripsByReference error ", error);
        }
      );
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
            this.sponsorships = Sponsorship.castJsonSponsorships(response.sponsorships);
            console.log("SingleTripComponent->getPaidSponsorships this.sponsorships length ", this.sponsorships.length);

            this.paidSponsorships = this.sponsorships.filter(sponsorship => sponsorship.getIsPayed() == true);
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

  favouriteTrip(trip: Trip) {
    console.log("favouriteTrip user.email ", this.user!.getEmail());
    console.log("favouriteTrip user.email-favourites ", this.user!.getEmail() + "-favourites");
    let favourites = localStorage.getItem(this.user!.getEmail() + "-favourites");
    console.log("favouriteTrip " + this.user!.getEmail() + "-favourites ", favourites);
    if (!favourites) { // Local Storage is empty
      let newFavourites = [];
      newFavourites.push(trip);
      console.log("favouriteTrip newFavourites ", newFavourites);
      localStorage.setItem(this.user!.getEmail() + "-favourites", JSON.stringify(newFavourites));
      let favouriteTrips = new FavouriteTrips(null);
      favouriteTrips.setReference(this.user!.getEmail() + "-favourites");
      favouriteTrips.setTrips(newFavourites);
      this.tripService.createFavouriteTripsReference(favouriteTrips)            
      .subscribe(
        (response: any) => {
          console.log("AllTripsComponent->favouriteTrip createReference response", response);
        },
        (error) => {
          console.error("AllTripsComponent->favouriteTrip createReference error", error);
        }
      );
    }
    else { // Local Storage has data
      let storedFavourites: Trip[] = JSON.parse(localStorage.getItem(this.user!.getEmail() + "-favourites") || '{}');
      let existsInFavourites: boolean = storedFavourites.some(storedTrip => Trip.castJsonTrip(storedTrip).getTicker() === trip.getTicker());
      console.log("favouriteTrip trip is in storedFavourites ", existsInFavourites);
      let updatedFavouriteTrips = new FavouriteTrips(null);
      let favouritesId: string;
      if (existsInFavourites) { // Trip exists in favourites
        storedFavourites.forEach((storedTrip, index) => {
          if (Trip.castJsonTrip(storedTrip).getTicker() === trip.getTicker()) {
            storedFavourites.splice(index, 1);
          }
        });
        console.log("favouriteTrip storedFavourites ", storedFavourites);
        localStorage.setItem(this.user!.getEmail() + "-favourites", JSON.stringify(storedFavourites));
        updatedFavouriteTrips.setReference(this.user!.getEmail() + "-favourites");
        updatedFavouriteTrips.setTrips(storedFavourites);
      } else {// Trip does not exist in favourites
        console.log("favouriteTrip storedFavourites ", storedFavourites);
        storedFavourites.push(trip);
        localStorage.setItem(this.user!.getEmail() + "-favourites", JSON.stringify(storedFavourites));
        updatedFavouriteTrips.setReference(this.user!.getEmail() + "-favourites");
        updatedFavouriteTrips.setTrips(storedFavourites);
      }
      this.tripService.getFavouriteTripsByReference(this.user!.getEmail() + "-favourites")
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            console.log("AllTripsComponent->getFavouriteTripsByReference response ", response[0]);
            let favourites = new FavouriteTrips(response[0]);
            console.log("AllTripsComponent->getFavouriteTripsByReference object ", favourites);
            console.log("AllTripsComponent->getFavouriteTripsByReference reference ", favourites.getReference());
            console.log("AllTripsComponent->getFavouriteTripsByReference trips ", favourites.getTrips());
            favouritesId = response[0].id;
            console.log("AllTripsComponent->getFavouriteTripsByReference response id ", favouritesId);

            this.tripService.updateFavouriteTripsReference(updatedFavouriteTrips, favouritesId)
            .subscribe(
              (response: any) => {
                console.log("AllTripsComponent->favouriteTrip updateReference response", response);
              },
              (error) => {
                console.error("AllTripsComponent->favouriteTrip updateReference error", error);
              }
           );
          }
          else {
            console.log("AllTripsComponent->getFavouriteTripsByReference response is empty");
          }
        },
        (error) => {
          console.error("AllTripsComponent->getFavouriteTripsByReference error", error);
        }
      );
    }
  }

  checkTripInFavourites(trip: Trip) {
    let result: boolean = false;
    //console.log("favouriteTrip user.email ", this.user!.getEmail());
    //console.log("favouriteTrip user.email-favourites ", this.user!.getEmail() + "-favourites");
    let favourites = localStorage.getItem(this.user!.getEmail() + "-favourites");
    //console.log("favouriteTrip " + this.user!.getEmail() + "-favourites ", favourites);
    if (favourites) {
      let storedFavourites: Trip[] = JSON.parse(localStorage.getItem(this.user!.getEmail() + "-favourites") || '{}');
      let existsInFavourites: boolean = storedFavourites.some(storedTrip => Trip.castJsonTrip(storedTrip).getTicker() === trip.getTicker());
     // console.log("favouriteTrip trip is in storedFavourites ", existsInFavourites);
      if (existsInFavourites) {
        result = true;
      }
    }
    return result;
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

    if(confirm("Are you sure to delete?, this action can't be undone."))
    {

      this.tripService.deleteTrip(trip.id)
      .then((response) => {

        console.log("SingleTripComponent->deleteTrip tripsService.deleteTrip then response ", response);
        this.success_message = response.message;

      })
      .catch((error) => {

        console.error("SingleTripComponent->deleteTrip tripsService.deleteTrip catch ", error);
        this.error_message = "Messages.something-went-wrong";

      });

    }
  }

  cancelTrip(trip: Trip) {

    this.error_message = "";
    this.success_message = "";

    if(confirm("Are you sure to cancel?"))
    {

      let cancelReason = prompt("Please enter the cancel reason");

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

          console.error("SingleTripComponent->cancelTrip tripsService.cancelTrip catch ", error);
          this.error_message = "Messages.something-went-wrong";

        });

      }

    }
  }

  publishTrip(trip: Trip) {

    this.error_message = "";
    this.success_message = "";

    if(confirm("Are you sure to publish?"))
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
  }

}
