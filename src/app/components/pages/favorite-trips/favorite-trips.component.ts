import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { FavouriteTrips } from 'src/app/models/favourite-trips.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips/trips.service';

@Component({
  selector: 'app-favorite-trips',
  templateUrl: './favorite-trips.component.html',
  styleUrls: ['./favorite-trips.component.scss']
})
export class FavoriteTripsComponent implements OnInit {

  storeTheme: string = localStorage.getItem('theme-color')!;
  trips: Array<Trip> = [];
  filteredTrips: Array<Trip> = [];
  trips_loaded!: Promise<boolean>;
  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected userId!: string | null;
  currentDateTime: Date;
  curPage: number = 1;
  pageSize: number = 10;

  keyword: string = "";

  constructor(private tripsService: TripsService, private router: Router, private authService: AuthService, private route: ActivatedRoute) {
    this.currentDateTime = new Date;
  }

  getTrips() {
    let storedFavourites: Trip[] = JSON.parse(localStorage.getItem(this.user!.getEmail() + "-favourites") || '{}');
    if (storedFavourites && storedFavourites.length > 0) {
      this.trips = Trip.castJsonTrips(storedFavourites);
      console.log("FavoriteTripsComponent->constructor getTrips this.trips ", this.trips);
      this.search();
    } else {
      this.trips = [];
    }

  }

  ngOnInit(): void {

    this.user = this.authService.getCurrentActor();
    if (this.user) {
      this.activeRole = this.user.getRole().toString();
      console.log("actor roles ", this.user.getRole());
      this.tripsService.getFavouriteTripsByReference(this.user!.getEmail() + "-favourites")
        .subscribe(
          (response: any) => {
            if (response.length > 0) {
              console.log("SingleTripComponent->getFavouriteTripsByReference response ", response[0]);
              let favourites = new FavouriteTrips(response[0]);
              console.log("SingleTripComponent->getFavouriteTripsByReference object ", favourites);
              console.log("SingleTripComponent->getFavouriteTripsByReference reference ", favourites.getReference());
              console.log("SingleTripComponent->getFavouriteTripsByReference trips ", favourites.getTrips());
              localStorage.setItem(favourites.getReference(), JSON.stringify(favourites.getTrips()));
              this.getTrips();
              this.trips_loaded = Promise.resolve(true);
            }
            else {
              console.log("SingleTripComponent->getFavouriteTripsByReference response is empty");
              this.trips_loaded = Promise.resolve(false);
            }
          },
          (error) => {
            console.error("SingleTripComponent->getFavouriteTripsByReference error ", error);
            this.trips_loaded = Promise.resolve(false);
          }
        );
    }
    else {
      this.activeRole = 'anonymous';
      this.getTrips();
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

  deleteTrip(trip: Trip) {
    console.log("deleteTrip", trip.id);

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
      this.tripsService.createFavouriteTripsReference(favouriteTrips)
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
      this.tripsService.getFavouriteTripsByReference(this.user!.getEmail() + "-favourites")
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

              this.tripsService.updateFavouriteTripsReference(updatedFavouriteTrips, favouritesId)
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
      //console.log("favouriteTrip trip is in storedFavourites ", existsInFavourites);
      if (existsInFavourites) {
        result = true;
      }
    }
    return result;
  }

  disabledTrip(trip: Trip) {
    let result = false;
    let difference = this.getDiffDays(trip.getStartDate().toString(), this.currentDateTime.toISOString());
    if (trip.isCanceled() || difference < 0) {
      result = true;
    }

    return result;
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route
    })
  }

  totalPages() {
    let pages = Math.ceil(this.filteredTrips.length / this.pageSize);
    if (pages <= 0) {
      pages = 1;
    }

    return pages;
  }

  search() {
    console.log("FavoriteTripsComponent-> search this.keyword ", this.keyword);

    
    if (this.keyword) {
      this.filteredTrips = this.trips.filter(trip => trip.getTitle().toLowerCase().includes(this.keyword.toLowerCase()));
      console.log("FavoriteTripsComponent-> search this.filteredTrips ", this.filteredTrips);
    } 
    else {
      this.filteredTrips = this.trips;
    }

  }

  resetSearch() {
    this.keyword = "";
    this.search();
  }
}
