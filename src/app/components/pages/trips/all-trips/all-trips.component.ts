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
import { FinderConfig, FindersService } from 'src/app/services/finders/finders.service';
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
  totalPages: number = 0;
  totalDocs: number = 0;
  pages: Array<number> = [];
  aditional_search_parameters: any = {"published": true, "canceled": false};
  showAddTripButton: boolean = false;
  searchTripForm;
  finderEnabled: boolean = false;
  protected actorId!: string;
  max_finder_results = 10;
  finder_cache_hours = 1;
  showSaveFinderButton: boolean = false;
  cacheName = 'finder';

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
            this.getFinderConfig();
          }
        }
      }
    }

    //console.log("this.finderEnableds", this.finderEnabled);
    if(this.finderEnabled == true)
    {
      this.getExplorerFinders();
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

  convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    return newDate;   
  }

  diffInHours(date1, date2)
  {
    var hours = Math.abs(date1 - date2) / 36e5;
    return hours;
  }

  renderTrips(response)
  {
    //console.log("renderTrips response ", response);
    this.totalPages = response.totalPages;
    this.totalDocs = response.totalDocs;
    this.pages = [];
    for (let page = 1; page <= this.totalPages; page++) {
      this.pages.push(page);
    }

    let json_trips = response.docs;
    //console.log("json_trips ", json_trips);
    let casted_trips = Trip.castJsonTrips(json_trips);
    //console.log("casted_trips ", casted_trips);

    this.trips = casted_trips;
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
    let url_parameters = new URLSearchParams(search_parameters).toString();
    url_parameters = url_parameters != '' ? '?'+url_parameters : '';
    //console.log("url_parameters ", url_parameters);
    let url: string = this.tripsService.getUrl(url_parameters);

    this.getTripsFromCache(url)
    .then((response: any) => {
      console.log("AllTripsComponent->getTripsFromCache response ", response);
      this.renderTrips(response);
    })
    .catch((error: any) => {
      console.error("AllTripsComponent->getTripsFromCache catch ", error);

      this.tripsService.getAllTrips(url)
      .then((response: any) => {
  
        console.log("AllTripsComponent->getTrips tripsService.getAllTrips then response ", response);
  
        this.renderTrips(response);
        this.storeTripsInCache(search_parameters);
  
        if(this.finderEnabled == true && this.totalDocs > 0 && this.finderFormValidToCreateFinder() == true)
        {
          this.showSaveFinderButton = true;
        }
  
      })
      .catch((error: any) => {
  
        console.error("AllTripsComponent->getTrips tripsService.getAllTrips catch ", error);
  
      });

    });

  }

  storeTripsInCache(search_parameters)
  {
    //cache url prepare - start
    let urls = [];
    for (let page = 1; page <= this.totalPages; page++) 
    {
      search_parameters["page"] = page as unknown as string;
      let url_parameters = new URLSearchParams(search_parameters).toString();
      url_parameters = url_parameters != '' ? '?'+url_parameters : '';
      //console.log("url_parameters ", url_parameters);
      const url = this.tripsService.getUrl(url_parameters);

      urls.push(url);
    }
    //cache url prepare - end

    //cache store - start
    caches.open(this.cacheName).then( cache => {
      cache.addAll(urls).then( () => {
        //console.log("Cached data from urls", urls)
      });
    });
    //cache store - end
  }

  getTripsFromCache(url: string)
  {

    return new Promise<any>((resolve, reject) => {

      //cache verification - start

      caches.open(this.cacheName).then(cache => {
        cache.match(url).then(cacheResponse => {
          console.log("cache.match(url).then(response", cacheResponse);
          //console.log("response.body", cacheResponse.body);
          //console.log("response.json()", response.json().);
          
          if(!cacheResponse) {
            //return fetch(url);
            console.log("fetch url 1");
            reject(null);
          }
          else
          {
            let reponse_date = new Date(cacheResponse.headers.get('Date'));
            //console.log("reponse_date ", reponse_date);
            let now = Date.now();
            //console.log("now ", now);
            let diffInHours = this.diffInHours(reponse_date, now);
            console.log("diffInHours ", diffInHours);
            
            if(diffInHours > this.finder_cache_hours)
            {
              //return fetch(url);
              console.log("fetch url 2");
              reject(null);
            }
            else
            {
              // else return cached version
              console.log("return cached version");
                
              resolve(cacheResponse.json());
    
              //return response;
            }
 
          }

        })
      })
      //cache verification - end

    });
  }

  getTripsFromService()
  {
    
  }

  finderFormValidToCreateFinder(): boolean
  {
    let formData = this.searchTripForm.value;
    let finderFormValidToCreateFinder = false;

    //only creates the finder if at least one search criterion has been stablished
    if(
      formData["keyWord"] != "" || 
      (formData["priceLowerBound"] != "" && formData["priceUpperBound"] != "") ||
      (formData["dateLowerBound"] != "" && formData["dateUpperBound"] != "")
    )
    {
      finderFormValidToCreateFinder = true;
    }

    return finderFormValidToCreateFinder;
  }

  getFinderConfig()
  {
    this.findersService.getFinderConfig()
    .then((response: any) => {

      console.log("AllTripsComponent->getFinderConfig findersService.getFinderConfig then response ", response);

      let finderConfig: FinderConfig = response as FinderConfig;

      this.finder_cache_hours = finderConfig.cacheHour;
      this.max_finder_results = finderConfig.maxFinderResults;

    })
    .catch((error: any) => {

      console.error("AllTripsComponent->getFinderConfig findersService.getFinderConfig catch ", error);

    });
  }

  createFinder()
  {

    let formData = this.searchTripForm.value;

    //console.log("formData 249", formData);

    let local_stored_actor = localStorage.getItem("currentActor");
    let actor = JSON.parse(local_stored_actor);
    let explorer_Id = actor._id;

    /*
    //delete the ticker because it breaks the json
    let cleaned_trips = this.trips.map((trip) => {
      delete trip['ticker'];
      return trip;
    })
    console.log("cleaned_trips", cleaned_trips);

    let results = {
      'results': cleaned_trips,
    };
    */
    let results = {};

    //console.log("this.finder_cache_hours ", this.finder_cache_hours);
    let expiration_date = new Date();
    expiration_date.setHours(expiration_date.getHours() + this.finder_cache_hours);     

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

  getExplorerFinders()
  {
    let explorer_Id = this.actorId;

    this.findersService.getExplorerFinders(explorer_Id)
    .then((response: any) => {

      console.log("AllTripsComponent->getExplorerFinders findersService.getExplorerFinders then response ", response);
      let status = response.status; 
      if(status == 204)//No finder was found
      {
        //this.search();
      }
      else if(status == 200)//finder found
      {
        let responseBody = response.body;
        let lastFinder = responseBody[0];
        
        if(lastFinder.hasOwnProperty('keyWord') && lastFinder.keyWord !== "" && lastFinder.keyWord !== null)
        {
          this.searchTripForm.controls.keyWord.setValue(lastFinder.keyWord);
        }
        if(lastFinder.hasOwnProperty('priceLowerBound') && lastFinder.priceLowerBound !== "" && lastFinder.priceLowerBound !== null)
        {
          this.searchTripForm.controls.priceLowerBound.setValue(lastFinder.priceLowerBound);
        }
        
        if(lastFinder.hasOwnProperty('priceUpperBound') && lastFinder.priceUpperBound !== "" && lastFinder.priceUpperBound !== null)
        {
          this.searchTripForm.controls.priceUpperBound.setValue(lastFinder.priceUpperBound);
        }
        
        //console.log("lastFinder.dateLowerBound ", lastFinder.dateLowerBound);
        if(lastFinder.hasOwnProperty('dateLowerBound') && lastFinder.dateLowerBound !== "" && lastFinder.dateLowerBound !== null)
        {
          let dateLowerBound = (new Date(lastFinder.dateLowerBound)).toLocaleDateString('en-CA');//YYY-mm-dd
          //console.log("dateLowerBound ", dateLowerBound);
          this.searchTripForm.controls.dateLowerBound.setValue(dateLowerBound);
        }
        
        if(lastFinder.hasOwnProperty('dateUpperBound') && lastFinder.dateUpperBound !== "" && lastFinder.dateUpperBound !== null)
        {
          let dateUpperBound = (new Date(lastFinder.dateUpperBound)).toLocaleDateString('en-CA');//YYY-mm-dd
          this.searchTripForm.controls.dateUpperBound.setValue(dateUpperBound);
        }

        /*
        if(lastFinder.hasOwnProperty('results') && lastFinder.results.length > 0)
        {
          let json_trips = lastFinder.results;
          let casted_trips = Trip.castJsonTrips(json_trips);
          this.trips = casted_trips;
        }
        */

        this.search();

      }


    })
    .catch((error: any) => {

      console.error("AllTripsComponent->getExplorerFinders findersService.getExplorerFinders catch ", error);
      this.search();

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
