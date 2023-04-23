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
import { FindersService } from 'src/app/services/finders/finders.service';
import { Finder } from 'src/app/models/finder/finder.model';


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
  //protected userId!: string | null;
  currentDateTime: Date;
  total_pages: number = 0;
  pages: Array<number> = [];
  aditional_search_parameters: any = {"published": true, "canceled": false};
  showAddTripButton: boolean = false;
  searchTripForm;
  finderEnabled: boolean = false;
  protected actorId!: string;
  
  //Para el CountDown
  interval:any;
  out_time!:string;

  constructor(
    private tripsService: TripsService, 
    private authService: AuthService,
    private fb: FormBuilder,
    private findersService: FindersService
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
        this.actorId = actor._id;

        if(actor.hasOwnProperty('role'))
        {
          let roles = actor["role"];
          //console.log("actor roles ", roles);
          if(roles.includes("MANAGER"))
          {
            delete this.aditional_search_parameters['published'];
            delete this.aditional_search_parameters['canceled'];
            this.aditional_search_parameters['managerId'] = this.actorId;
            this.showAddTripButton = true;
          } 
          else if (roles.includes("EXPLORER")) 
          {
            this.finderEnabled = true;
            this.getFavoriteTrips();
          }
        }
      }
    }

    //console.log("this.finderEnableds", this.finderEnabled);
    if(this.finderEnabled == true)
    {
      this.getSingleFinder();
    }
    else
    {
      this.search();
    }

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
    //console.log("formData", formData);

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

      this.createFinder();

    })
    .catch((error: any) => {

      console.error("AllTripsComponent->constructor tripsService.getAllTrips catch ", error);

    });
  }

  createFinder()
  {

    if(this.finderEnabled == true)
    {
      let formData = this.searchTripForm.value;

      //only creates the finder if at least one search criteria has been stablished
      if(
        formData["keyWord"] != "" || 
        (formData["priceLowerBound"] != "" && formData["priceUpperBound"] != "") ||
        (formData["dateLowerBound"] != "" && formData["dateUpperBound"] != "")
      )
      {
        //console.log("formData 249", formData);

        let local_stored_actor = localStorage.getItem("currentActor");
        let actor = JSON.parse(local_stored_actor);
        let explorer_Id = actor._id;
  
        //delete the ticker because it breaks the json
        let cleaned_trips = this.trips.map((trip) => {
          delete trip['ticker'];
          return trip;
        })
        console.log("cleaned_trips", cleaned_trips);
    
        let results = {
          'results': cleaned_trips,
        };

        let cache_minutes = 5;
        let expiration_date = new Date();
        expiration_date.setMinutes(expiration_date.getMinutes() + cache_minutes);     
    
        let other_fields = {
          'explorer_Id': explorer_Id,
          'expiration_date': expiration_date,
        };
  
        let finder = {
          ...formData,
          ...results,
          ...other_fields
        };
        console.log("finder ", finder);
  
        //let casted_finder = new Finder(finder);
        //console.log("casted_finder ", casted_finder);
  
        //let stringified_finder = JSON.stringify(finder);
        //console.log("stringified_finder ", stringified_finder);
    
        this.findersService.createFinder(finder)
        .then((response: any) => {
    
          console.log("AllTripsComponent->createFinder findersService.createFinder then response ", response);
    
        })
        .catch((error: any) => {
    
          console.error("AllTripsComponent->createFinder findersService.createFinder catch ", error);
    
        });

      }

    }

  }

  getSingleFinder()
  {
    let explorer_Id = this.actorId;

    this.findersService.getSingleFinder(explorer_Id)
    .then((response: any) => {

      console.log("AllTripsComponent->getSingleFinder findersService.getSingleFinder then response ", response);
      let status = response.status; 
      if(status == 204)//No finder was found
      {
        //this.search();
      }
      else if(status == 200)//finder found
      {
        let responseBody = response.body;
        
        if(responseBody.hasOwnProperty('keyWord') && responseBody.keyWord !== "" && responseBody.keyWord !== null)
        {
          this.searchTripForm.controls.keyWord.setValue(responseBody.keyWord);
        }
        if(responseBody.hasOwnProperty('priceLowerBound') && responseBody.priceLowerBound !== "" && responseBody.priceLowerBound !== null)
        {
          this.searchTripForm.controls.priceLowerBound.setValue(responseBody.priceLowerBound);
        }
        
        if(responseBody.hasOwnProperty('priceUpperBound') && responseBody.priceUpperBound !== "" && responseBody.priceUpperBound !== null)
        {
          this.searchTripForm.controls.priceUpperBound.setValue(responseBody.priceUpperBound);
        }
        
        //console.log("responseBody.dateLowerBound ", responseBody.dateLowerBound);
        if(responseBody.hasOwnProperty('dateLowerBound') && responseBody.dateLowerBound !== "" && responseBody.dateLowerBound !== null)
        {
          let dateLowerBound = (new Date(responseBody.dateLowerBound)).toLocaleDateString('en-CA');//YYY-mm-dd
          //console.log("dateLowerBound ", dateLowerBound);
          this.searchTripForm.controls.dateLowerBound.setValue(dateLowerBound);
        }
        
        if(responseBody.hasOwnProperty('dateUpperBound') && responseBody.dateUpperBound !== "" && responseBody.dateUpperBound !== null)
        {
          let dateUpperBound = (new Date(responseBody.dateUpperBound)).toLocaleDateString('en-CA');//YYY-mm-dd
          this.searchTripForm.controls.dateUpperBound.setValue(dateUpperBound);
        }

        if(responseBody.hasOwnProperty('results') && responseBody.results.length > 0)
        {
          let json_trips = responseBody.results;
          let casted_trips = Trip.castJsonTrips(json_trips);
          this.trips = casted_trips;
        }
      }


    })
    .catch((error: any) => {

      console.error("AllTripsComponent->getSingleFinder findersService.getSingleFinder catch ", error);
      //this.search();

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

  toggleFavouriteTrip(trip: Trip) {
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

  getFavoriteTrips()
  {
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
