import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { FavouriteLists } from 'src/app/models/favourite-lists.model';
import { FavouriteTrips } from 'src/app/models/favourite-trips.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips/trips.service';

@Component({
  selector: 'app-update-favourite-lists',
  templateUrl: './update-favourite-lists.component.html',
  styleUrls: ['./update-favourite-lists.component.scss']
})
export class UpdateFavouriteListsComponent implements OnInit {

  favouriteTripsForm: FormGroup;
  protected user!: Actor | null;
  trip_id!: string;

  trip!: Trip;
  json_trip: any;

  no_lists: boolean = false;
  charged_trip: boolean = false;

  favouriteTripsLists: any;
  ListReference: any;
  listContainsTrip: any;
  favouriteChanges: any;

  update_success: boolean = false;
  no_changes: boolean = false;

  constructor(private tripService: TripsService,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute) {
    this.user = this.authService.getCurrentActor();
    this.trip_id = this.route.snapshot.params['id'];
    this.favouriteTripsForm = this.fb.group({
      favouriteLists: new FormArray([])
    });
    this.tripService.getFavouriteTripsListsByExplorerId(this.user!.id)
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            console.log("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId response ", response[0]);
            let favourites = new FavouriteLists(response[0]);
            console.log("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId object ", favourites);
            console.log("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId trips ", favourites.favourite_trips);
            localStorage.setItem(this.user!.id + "-favourites", JSON.stringify(favourites.favourite_trips));
            this.getListReferences();
            this.getTrip();
          }
          else {
            console.log("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId response is empty");
          }
        },
        (error) => {
          console.error("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId error ", error);
        }
      );
  }

  private addCheckboxes() {
    this.ListReference.forEach(() => this.favouriteListsFormArray.push(new FormControl(false)));
  }

  get favouriteListsFormArray() {
    return this.favouriteTripsForm.controls['favouriteLists'] as FormArray;
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.no_changes = false;
    this.update_success = false;

    let newFavourites = [];
    this.favouriteTripsForm.value.favouriteLists.forEach((value, index) => {
      console.log("value === this.listContainsTrip[index]", value === this.listContainsTrip[index]);
      if (value === this.listContainsTrip[index]) {
        newFavourites.push(null);
      }
      else {
        newFavourites.push(value);
      }
    });

    console.log("newFavourites", newFavourites);

    let favouritesChanged = newFavourites.some(value => value != null);

    if (favouritesChanged) {
      newFavourites.forEach((value, listIndex) => {
        console.log("index", listIndex);
        if (value != null) {
          if (value) {
            let trips = this.favouriteTripsLists[listIndex].getTrips();
            console.log("trips", trips);
            trips.push(this.trip);
            console.log("trips added", trips);
            this.favouriteTripsLists[listIndex].setTrips(trips);
          }
          else {
            this.favouriteTripsLists[listIndex].getTrips().forEach((storedTrip, tripIndex) => {
              if (Trip.castJsonTrip(storedTrip).getTicker() === this.trip.getTicker()) {
                let trips = this.favouriteTripsLists[listIndex].getTrips();
                console.log("trips", trips);
                trips.splice(tripIndex, 1);
                console.log("trips deleted", trips);
                this.favouriteTripsLists[listIndex].setTrips(trips);
              }
            });
          }
        }
      });
      console.log("this.favouriteTripsLists", this.favouriteTripsLists);
      localStorage.setItem(this.user!.id + "-favourites", JSON.stringify(this.favouriteTripsLists));
      
      this.tripService.getFavouriteTripsListsByExplorerId(this.user!.id)
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            console.log("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId response ", response[0]);
            let favourites = new FavouriteLists(response[0]);
            console.log("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId object ", favourites);
            console.log("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId trips ", favourites.favourite_trips);
            let favouritesId = favourites.id;
            console.log("UpdateFavouriteListsComponent->getFavouriteTripsByReference response id ", favouritesId);

            favourites.favourite_trips = this.favouriteTripsLists; 

            this.tripService.updateFavouriteTripsListsReference(favourites, favouritesId)
              .subscribe(
                (response: any) => {
                  console.log("UpdateFavouriteListsComponent->favouriteTrip updateReference response", response);
                  this.update_success = true;
                },
                (error) => {
                  console.error("UpdateFavouriteListsComponent->favouriteTrip updateReference error", error);
                }
              );
          }
          else {
            console.log("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId response is empty");
          }
        },
        (error) => {
          console.error("UpdateFavouriteListsComponent->getFavouriteTripsListsByExplorerId error", error);
        }
      );
    }
    else {
      this.no_changes = true;
    }
  }

  getListReferences() {
    let favouritesLists = localStorage.getItem(this.user!.id + "-favourites");
    console.log("getListReferences " + this.user!.id + "-favourites", favouritesLists);
    if (!favouritesLists) { // Local Storage is empty
      this.no_lists = true;
    }
    else { // Local Storage has data
      let storedFavouritesLists: FavouriteTrips[] = JSON.parse(localStorage.getItem(this.user!.id + "-favourites") || '{}');
      let castedStoredFavouritesLists = storedFavouritesLists.map(storedList => {
        return new FavouriteTrips(storedList);
      });
      console.log("getListReferences castedStoredFavouritesLists ", castedStoredFavouritesLists);
      this.favouriteTripsLists = castedStoredFavouritesLists;
      this.ListReference = castedStoredFavouritesLists.map(list => {
        return list.getReference()
      })
      console.log("getListReferences this.ListReference ", this.ListReference);
    }
  }

  async getTrip() {
    await this.tripService.getSingleTrip(this.trip_id)
      .then((response) => {

        console.log("ApplicationcreationComponent->constructor tripsService.getSingleTrip then response ", response);
        this.json_trip = response;
        console.log("this.json_trip", this.json_trip);

        let casted_trip: Trip = Trip.castJsonTrip(this.json_trip);
        this.trip = casted_trip;
        console.log("ApplicationcreationComponent->constructor tripsService.getSingleTrip this.trip ", this.trip);
        this.charged_trip = true;
        this.continueConstructor();
      })
      .catch((error) => {
        console.error("ApplicationcreationComponent->constructor tripsService.getSingleTrip catch ", error);

      });
  }

  checkTripInLists() {
    let result = [];

    let favourites = localStorage.getItem(this.user!.id + "-favourites");
    if (favourites) {
      let storedFavouritesLists: FavouriteTrips[] = JSON.parse(localStorage.getItem(this.user!.id + "-favourites") || '{}');
      let castedStoredFavouritesLists = storedFavouritesLists.map(storedList => {
        return new FavouriteTrips(storedList)
      });
      let favouriteLists = new FavouriteLists({
        favourite_trips: castedStoredFavouritesLists, explorer_Id: this.user!.id
      });
      console.log("checkTripInLists favouriteLists", favouriteLists);
      console.log("checkTripInLists favouriteLists.favourite_trips", favouriteLists.favourite_trips);
      favouriteLists.favourite_trips.forEach(list => {
        console.log("checkTripInLists favouriteLists list", list);
        let existsTrip = list.getTrips().some(favouriteTrip => new Trip(favouriteTrip).getTicker() == this.trip.getTicker());
        result.push(existsTrip);
      });
    }
    console.log(result);
    return result;
  }

  continueConstructor() {
    if (!this.no_lists) {
      this.addCheckboxes();
      this.listContainsTrip = this.checkTripInLists();
      (<FormArray>this.favouriteTripsForm.controls['favouriteLists']).setValue(this.listContainsTrip);
    }
  }
}
