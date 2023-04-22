import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actor } from 'src/app/models/actor.model';
import { Application } from 'src/app/models/application.model';
import { Trip } from 'src/app/models/trip.model';
import { ApplicationsService } from 'src/app/services/applications.service';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips/trips.service';
import { differenceInMilliseconds } from 'date-fns';
import { FavouriteTrips } from 'src/app/models/favourite-trips.model';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';


const PriceRangeValidator: ValidatorFn = (fg: FormGroup) => {

  let valid = null;

  if(fg !== null && typeof fg !== "undefined")
  {
    const start = fg.get('priceLowerBound')?.value;
    const end = fg.get('priceUpperBound')?.value;
    valid = ( start !== null && end !== null && start <= end ) ? null  : {"price_range" : true};
  }

  return valid;
};

const DateRangeValidator: ValidatorFn = (fg: FormGroup) => {

  let valid = null;

  if(fg !== null && typeof fg !== "undefined")
  {
    const start = fg.get('dateLowerBound')?.value;
    const end = fg.get('dateUpperBound')?.value;
    //console.log("start ", start);
    //console.log("end ", end);

    if(start !== null && start !== "" && end !== null && end !== "")
    {
      let startDateObject = new Date(start).getTime();
      let endDateObject = new Date(end).getTime();
      valid = (startDateObject <= endDateObject) ? null  : {"date_range" : true};
    }
    
  }
  //console.log("valid ", valid);

  return valid;
};

@Component({
  selector: 'app-all-trips',
  templateUrl: './all-trips.component.html',
  styleUrls: ['./all-trips.component.scss']
})
export class AllTripsComponent implements OnInit {

  storeTheme: string = localStorage.getItem('theme-color')!;
  trips: Array<Trip> = [];
  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected userId!: string | null;
  currentDateTime: Date;
  total_pages: number = 0;
  pages: Array<number> = [];
  aditional_search_parameters: any = {"published": true, "canceled": false};
  showAddTripButton: boolean = false;
  searchTripForm;
  
  //Para el CountDown
  interval:any;
  out_time!:string;

  constructor(
    private tripsService: TripsService, 
    private authService: AuthService,
    private fb: FormBuilder
  )
  {
    this.currentDateTime = new Date;
    this.searchTripForm = this.createForm();

    /*
    setInterval(() => {
      //console.log("this.searchTripForm", this.searchTripForm);
    }, 1000);
    */
  }

  createForm()
  {
    return this.fb.group(
      {
        keyWord: ["", [Validators.pattern('^[a-zA-Z]+')]],
        priceLowerBound: ["", [Validators.min(0), Validators.max(999999)]],
        priceUpperBound: ["", [Validators.min(0), Validators.max(999999)]],
        dateLowerBound: [""],
        dateUpperBound: [""],
      },
      { validator: [PriceRangeValidator, DateRangeValidator] }
    );
  }

  ngOnInit(): void 
  {

    this.user = this.authService.getCurrentActor();
    if (this.user) {
      this.activeRole = this.user.getRole().toString();
    }
    else {
      this.activeRole = 'anonymous';
    }

    let local_stored_actor = localStorage.getItem("currentActor");
    if(local_stored_actor != null)
    {
      let actor = JSON.parse(local_stored_actor);
      if(actor != null)
      {
        if(actor.hasOwnProperty('role'))
        {
          let roles = actor["role"];
          //console.log("actor roles ", roles);
          if(roles.includes("MANAGER"))
          {
            //aditional_search_parameters.push({key: 'managerId', value: actor._id});
            delete this.aditional_search_parameters['published'];
            delete this.aditional_search_parameters['canceled'];
            this.aditional_search_parameters['managerId'] = actor._id;
            this.showAddTripButton = true;
          } else if (roles.includes("EXPLORER")) {
            this.tripsService.getFavouriteTripsByReference(this.user!.getEmail() + "-favourites")
            .subscribe(
              (response: any) => {
                if (response.length > 0) {
                  console.log("AllTripsComponent->getFavouriteTripsByReference response ", response[0]);
                  let favourites = new FavouriteTrips(response[0]);
                  console.log("AllTripsComponent->getFavouriteTripsByReference object ", favourites);
                  console.log("AllTripsComponent->getFavouriteTripsByReference reference ", favourites.getReference());
                  console.log("AllTripsComponent->getFavouriteTripsByReference trips ", favourites.getTrips());
                  localStorage.setItem(favourites.getReference(), JSON.stringify(favourites.getTrips()));
                }
                else {
                  console.log("AllTripsComponent->getFavouriteTripsByReference response is empty");
                }
              },
              (error) => {
                console.error("AllTripsComponent->getFavouriteTripsByReference error ", error);
              }
            );
          }
        }
      }
    }
    //console.log("aditional_search_parameters", this.aditional_search_parameters);

    this.search();
    this.interval = setInterval(() => {
      this.countDownTimer("start");
    }, 1000);
  }

  search()
  {
    this.getTrips(1);
  }

  getTrips(page: number) 
  {
    
    let search_parameters = {"page": page as unknown as string};

    if(this.aditional_search_parameters != null)
    {
      search_parameters = {
        ...search_parameters,
        ...this.aditional_search_parameters
      };
    }

    let formData = this.searchTripForm.value;
    console.log("formData", formData);

    for (let [key, value] of Object.entries(formData)) {
      //console.log(`{${key}: ${value}}`);

      if(value != "")
      {
        let new_search_parameter = JSON.parse(`{ "${key}" : "${value}" }`);
        //console.log("new_search_parameter", new_search_parameter);
        search_parameters = {
          ...search_parameters,
          ...new_search_parameter
        };
      }
    }
    
    //console.log("search_parameters ", search_parameters);

    this.tripsService.getAllTrips(search_parameters)
      .then((response: any) => {

        console.log("AllTripsComponent->constructor tripsService.getAllTrips then response ", response);

        this.total_pages = response.totalPages;

        this.pages = [];
        for (let page = 1; page <= this.total_pages; page++) {
          this.pages.push(page);
        }

        let json_trips = response.docs;
        //console.log("json_trips ", json_trips);
        let casted_trips = Trip.castJsonTrips(json_trips);
        //console.log("casted_trips ", casted_trips);

        this.trips = casted_trips;

      })
      .catch((error: any) => {

        console.error("AllTripsComponent->constructor tripsService.getAllTrips catch ", error);

      });
  }

  getDiffDays(start: string, now: string) {
    var startDate = new Date(start);
    var endDate = new Date(now);

    var difference = startDate.getTime() - endDate.getTime();
    return difference / (1000 * 3600 * 24);
  }

  countDownTimer(start: string){
    let startDate = new Date(start);
    let now = new Date();
    const difference = differenceInMilliseconds(startDate, now);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    if(difference >0){
      return  days +"d "+hours+"hr "+minutes+"min "+seconds+"sec ";
    } 
    else{
       return "-"
  }
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

  getNowAndStartDateDiffInDays(trip: Trip)
  {
    return this.getDiffDays(trip.getStartDate().toString(), this.currentDateTime.toISOString());
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

}
