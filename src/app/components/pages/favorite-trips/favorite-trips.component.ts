import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { FavouriteLists } from 'src/app/models/favourite-lists.model';
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
  favouriteLists: FavouriteTrips[];
  favouriteLists_loaded!: Promise<boolean>;
  favouriteListsReferences: string[];
  trips: Array<Trip> = [];
  filteredReferences: Array<string> = [];
  trips_loaded!: Promise<boolean>;
  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected userId!: string | null;
  currentDateTime: Date;
  curPage: number = 1;
  pageSize: number = 10;

  curReference: string;

  listCreation: boolean = false;
  listCreated: boolean = false;
  listExists: boolean = false;

  keyword: string = "";

  constructor(private tripsService: TripsService, private router: Router, private authService: AuthService, private route: ActivatedRoute) {
    this.currentDateTime = new Date;
  }

  getFavouriteLists() {
    let storedFavouritesLists = JSON.parse(localStorage.getItem(this.user!.id + "-favourites"));
    console.log(storedFavouritesLists);
    if (storedFavouritesLists) {
      this.favouriteLists = storedFavouritesLists.map(storedList => {
        return new FavouriteTrips(storedList)
      });
      this.favouriteListsReferences = this.favouriteLists.map(storedList => {
        return storedList.getReference();
      });
      this.search();
      this.getTrips(this.curReference);
    } else {
      this.favouriteLists = [];
      this.favouriteListsReferences = [];
    }

    this.favouriteLists_loaded = Promise.resolve(true);

  }

  getTrips(reference: string) {
    this.curReference = reference;
    this.trips = [];

    this.favouriteLists.forEach(list => {
      if (list.getReference() == reference) {
        console.log("list.getTrips()", list.getTrips());
        this.trips = Trip.castJsonTrips(list.getTrips());
        this.trips_loaded = Promise.resolve(true);
      }
    });
    console.log("trips", this.trips);
  }

  getCurrentNavigatorStyles(reference: string) {
    let actual = this.curReference == reference;
    let currenStyles = {
      'font-weight': actual ? 'bold' : '',
      'font-size': actual ? '115%' : ''
    };

    return currenStyles;
  }

  ngOnInit(): void {

    this.user = this.authService.getCurrentActor();
    if (this.user) {
      this.activeRole = this.user.getRole().toString();
      console.log("actor roles ", this.user.getRole());
      this.tripsService.getFavouriteTripsListsByExplorerId(this.user!.id)
        .subscribe(
          (response: any) => {
            if (response.length > 0) {
              console.log("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId response ", response[0]);
              let favourites = new FavouriteLists(response[0]);
              console.log("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId object ", favourites);
              console.log("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId trips ", favourites.favourite_trips);
              localStorage.setItem(this.user!.id + "-favourites", JSON.stringify(favourites.favourite_trips));
            }
            else {
              console.log("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId response is empty");
            }
            this.getFavouriteLists();
          },
          (error) => {
            console.error("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId error ", error);
          }
        );
    }
    else {
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

  deleteTrip(trip: Trip) {
    console.log("deleteTrip", trip.id);

  }

  startListCreation() {
    this.listCreation = true;
    console.log("Cargado", this.listCreation)
  }

  createFavoriteList(referenceForm: NgForm) {
    console.log("createFavoriteList referenceForm.value.reference", referenceForm.value.reference);

    console.log("createFavoriteList user.id ", this.user!.id);
    console.log("createFavoriteList user.id-favourites ", this.user!.id + "-favourites");
    let favouritesLists = localStorage.getItem(this.user!.id + "-favourites");
    console.log("createFavoriteList " + this.user!.id + "-favourites", favouritesLists);
    if (!favouritesLists) { // Local Storage is empty
      let newFavouritesLists = [];
      let newFavouriteTrips = new FavouriteTrips({
        reference: referenceForm.value.reference, trips: []
      });
      console.log("createFavoriteList newFavouriteTrips", newFavouriteTrips);
      newFavouritesLists.push(newFavouriteTrips);
      console.log("createFavoriteList newFavouritesLists", newFavouritesLists);
      localStorage.setItem(this.user!.id + "-favourites", JSON.stringify(newFavouritesLists));

      let favouriteTripsLists = new FavouriteLists(null);
      favouriteTripsLists.explorer_Id = this.user!.id;
      favouriteTripsLists.favourite_trips = newFavouritesLists;
      this.tripsService.createFavouriteTripsListsReference(favouriteTripsLists)
        .subscribe(
          (response: any) => {
            console.log("AllTripsComponent->favouriteTrip createReference response", response);
          },
          (error) => {
            console.error("AllTripsComponent->favouriteTrip createReference error", error);
          }
        );

      this.listCreated = true;
      this.listCreation = false;
      console.log("createFavoriteList Descargado", this.listCreation);
    }
    else { // Local Storage has data
      let storedFavouritesLists: FavouriteTrips[] = JSON.parse(localStorage.getItem(this.user!.id + "-favourites") || '{}');
      let castedStoredFavouritesLists = storedFavouritesLists.map(storedList => {
        return new FavouriteTrips(storedList)
      });
      let favouriteLists = new FavouriteLists({
        favourite_trips: castedStoredFavouritesLists, explorer_Id: this.user!.id
      });
      console.log("createFavoriteList favouriteLists", favouriteLists);
      console.log("createFavoriteList favouriteLists.favourite_trips", favouriteLists.favourite_trips);
      let existsInFavouritesLists: boolean = storedFavouritesLists.some(storedList => new FavouriteTrips(storedList).getReference() === referenceForm.value.reference);
      console.log("createFavoriteList list is in storedFavouritesLists ", existsInFavouritesLists);
      let newFavouriteLists = new FavouriteTrips({
        reference: referenceForm.value.reference, trips: []
      });
      if (!existsInFavouritesLists) { // List does not exist in favourites
        favouriteLists.favourite_trips.push(newFavouriteLists);
        console.log("favouriteTrip favouriteLists ", favouriteLists);
        localStorage.setItem(this.user!.id + "-favourites", JSON.stringify(favouriteLists.favourite_trips));

        this.tripsService.getFavouriteTripsListsByExplorerId(this.user!.id)
        .subscribe(
          (response: any) => {
            if (response.length > 0) {
              console.log("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId response ", response[0]);
              let favourites = new FavouriteLists(response[0]);
              console.log("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId object ", favourites);
              console.log("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId trips ", favourites.favourite_trips);
              let favouritesId = favourites.id;
              console.log("AllTripsComponent->getFavouriteTripsByReference response id ", favouritesId);

              this.tripsService.updateFavouriteTripsListsReference(favouriteLists, favouritesId)
                .subscribe(
                  (response: any) => {
                    console.log("FavoriteTripsComponent->favouriteTrip updateReference response", response);
                  },
                  (error) => {
                    console.error("FavoriteTripsComponent->favouriteTrip updateReference error", error);
                  }
                );
            }
            else {
              console.log("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId response is empty");
            }
          },
          (error) => {
            console.error("FavoriteTripsComponent->getFavouriteTripsListsByExplorerId error", error);
          }
        );

        this.listCreated = true;
        this.listCreation = false;
        console.log("createFavoriteList Descargado", this.listCreation);
      } else {// List exists in favourites
        this.listExists = true;
      }
    }
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
    let pages = Math.ceil(this.trips.length / this.pageSize);
    if (pages <= 0) {
      pages = 1;
    }

    return pages;
  }

  search() {
    console.log("FavoriteTripsComponent-> search this.keyword ", this.keyword);

    if (this.keyword) {
      this.filteredReferences = this.favouriteListsReferences.filter(reference => reference.toLowerCase().includes(this.keyword.toLowerCase()));
      console.log("FavoriteTripsComponent-> search this.filteredTrips ", this.filteredReferences);
    }
    else {
      this.filteredReferences = this.favouriteListsReferences;
    }

    this.curReference = this.filteredReferences[0];
    this.getTrips(this.curReference);
  }

  resetSearch() {
    this.keyword = "";
    this.search();
  }
}
