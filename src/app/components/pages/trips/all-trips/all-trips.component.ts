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
import { ActivatedRoute } from '@angular/router';
import { trackTrip } from 'src/app/interfaces/trackTrip';

const PriceRangeValidator: ValidatorFn = (fg: FormGroup) => {

  let valid = null;

  if(fg !== null && typeof fg !== "undefined")
  {
    const start = fg.get('priceLowerBound')?.value;
    const end = fg.get('priceUpperBound')?.value;
    //console.log("PriceRangeValidator start", start);
    //console.log("PriceRangeValidator end", end);
    let start_selected = (start !== null && start !== "");
    let end_selected = (end !== null && end !== "");
    //console.log("start_selected", start_selected);
    //console.log("end_selected", end_selected);

    let both_selected = (start_selected && end_selected);
    let some_selected = (start_selected || end_selected);
    //console.log("both_selected", both_selected);
    //console.log("some_selected", some_selected);

    if(some_selected)
    {
      valid = ( both_selected && start <= end ) ? null  : {"price_range" : true};
    }
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
    let start_selected = (start !== null && start !== "");
    let end_selected = (end !== null && end !== "");

    let both_selected = (start_selected && end_selected);
    let some_selected = (start_selected || end_selected);
    //console.log("both_selected", both_selected);
    //console.log("some_selected", some_selected);

    if(some_selected)
    {
      let startDateObject = new Date(start).getTime();
      let endDateObject = new Date(end).getTime();
      valid = (both_selected && startDateObject <= endDateObject) ? null  : {"date_range" : true};
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
  base_search_parameters: any = {"published": true, "canceled": false};
  global_search_parameters: any = {};
  showAddTripButton: boolean = false;
  searchTripForm;
  finderEnabled: boolean = false;
  protected actorId!: string;
  max_finder_results = 10;
  finder_cache_hours = 1;
  showSaveFinderButton: boolean = false;
  cacheName = 'finder';
  create_finder_sucess_message;
  results_per_page = 10;
  finder_id!: string;
  finders;

  //Para el CountDown
  interval:any;
  out_time!:string;

  constructor(
    private tripsService: TripsService, 
    private authService: AuthService,
    private fb: FormBuilder,
    private findersService: FindersService,
    private route: ActivatedRoute
  )
  {
    this.currentDateTime = new Date;
    this.searchTripForm = this.createForm();
    this.searchTripForm.valueChanges.subscribe((data) => {
      console.log("AllTripsComponent->constructor searchTripForm.valueChanges.subscribe ", data);
      this.showSaveFinderButton = false;
    });
  }

  ngOnInit(): void 
  {
    this.route.queryParams.subscribe(params => {
      this.finder_id = params['finder_id'];
    });
    //this.finder_id = this.route.snapshot.paramMap.get('finder_id');

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
            delete this.base_search_parameters['published'];
            delete this.base_search_parameters['canceled'];
            this.base_search_parameters['managerId'] = this.actorId;
            this.showAddTripButton = true;
          } 
          else if (roles.includes("EXPLORER")) 
          {
            this.finderEnabled = true;
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

  createForm()
  {
    return this.fb.group(
      {
        keyWord: ["", [Validators.pattern('^[0-9A-Za-z\-]+')]],
        priceLowerBound: ["", [Validators.min(0), Validators.max(999999)]],
        priceUpperBound: ["", [Validators.min(0), Validators.max(999999)]],
        dateLowerBound: [""],
        dateUpperBound: [""],
      },
      { validator: [PriceRangeValidator, DateRangeValidator] }
    );
  }

  search()
  {
    this.create_finder_sucess_message = "";
    this.getTrips(1);
  }

  getTrips(page: number) 
  {
    
    this.updateGlobalSearchParameters(page);
    
    //console.log("search_parameters ", search_parameters);
    let url_parameters = this.searchParametersToUrlParameters(this.global_search_parameters);
    //console.log("url_parameters ", url_parameters);
    let url: string = this.tripsService.getUrl(url_parameters);

    this.getTripsFromCache(url)
    .then((response: any) => {
      console.log("AllTripsComponent->getTripsFromCache response ", response);
      this.showSaveFinderButton = false;
      this.renderTrips(response);
    })
    .catch((error: any) => {
      //
      console.error("AllTripsComponent->getTripsFromCache catch ", error);

      this.getTripsFromService(url);

    });

  }

  getTripsFromCache(url: string)
  {

    return new Promise<any>((resolve, reject) => {

      //cache verification - start

      //console.log("AllTripsComponent->getTripsFromCache url", url);

      caches.open(this.cacheName).then(cache => {
        cache.match(url).then(cacheResponse => {
          console.log("AllTripsComponent->getTripsFromCache response", cacheResponse);
          //console.log("response.body", cacheResponse.body);
          //console.log("response.json()", response.json().);
          
          if(!cacheResponse) {
            //return fetch(url);
            //console.log("AllTripsComponent->getTripsFromCache url not found in cache");
            reject({error: "Data not found in cache."});
          }
          else
          {
            let reponse_date = new Date(cacheResponse.headers.get('Date'));
            //console.log("reponse_date ", reponse_date);
            let now = Date.now();
            //console.log("now ", now);
            let diffInHours = this.diffInHours(reponse_date, now);
            //console.log("AllTripsComponent->getTripsFromCache diffInHours ", diffInHours);
            //console.log("AllTripsComponent->getTripsFromCache this.finder_cache_hours ", this.finder_cache_hours);
            
            if(diffInHours > this.finder_cache_hours)
            {
              //return fetch(url);
              //console.log("AllTripsComponent->getTripsFromCache cache expired");
              cache.delete(url);
              reject({error: "Data not found in cache."});
            }
            else
            {
              // else return cached version
              //console.log("AllTripsComponent->getTripsFromCache returning cached version");
                
              resolve(cacheResponse.json());
    
              //return response;
            }
 
          }

        })
      })
      //cache verification - end

    });
  }

  getTripsFromService(url: string)
  {
    this.tripsService.getAllTrips(url)
    .then((response: any) => {

      console.log("AllTripsComponent->getTrips tripsService.getAllTrips then response ", response);

      this.renderTrips(response);
      this.storeTripsInCache();

      if(this.finderEnabled == true && this.totalDocs > 0 && this.finderFormValidToCreateFinder() == true)
      {
        this.showSaveFinderButton = true;
      }
      else
      {
        this.showSaveFinderButton = false;
      }

    })
    .catch((error: any) => {

      console.error("AllTripsComponent->getTrips tripsService.getAllTrips catch ", error);

    });
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

  updateGlobalSearchParameters(page: number)
  {
    let search_parameters = {"page": page as unknown as string};

    if(this.base_search_parameters != null)
    {
      search_parameters = {
        ...search_parameters,
        ...this.base_search_parameters
      };
    }

    let formData = this.searchTripForm.value;
    //console.log("formData", formData);

    for (let [key, value] of Object.entries(formData)) {
      //console.log(`{${key}: ${value}}`);

      if(value != "" && value != null)
      {
        let new_search_parameter = JSON.parse(`{ "${key}" : "${value}" }`);
        //console.log("new_search_parameter", new_search_parameter);
        search_parameters = {
          ...search_parameters,
          ...new_search_parameter
        };
      }
    }

    this.global_search_parameters = search_parameters;
  }

  searchParametersToUrlParameters(search_parameters)
  {
    let url_parameters = new URLSearchParams(search_parameters).toString();
    url_parameters = url_parameters != '' ? '?'+url_parameters : '';
    //console.log("url_parameters ", url_parameters);
    return url_parameters;
  }

  storeTripsInCache()
  {
    let search_parameters = this.global_search_parameters;

    let total_docs_cached = 0;
    //cache url prepare - start
    let urls = [];
    for (let page = 1; page <= this.totalPages; page++) 
    {
      total_docs_cached += this.results_per_page;

      if(total_docs_cached > this.max_finder_results)
      {
        console.log("AllTripsComponent->storeTripsInCache total_docs_cached", total_docs_cached);
        console.log("AllTripsComponent->storeTripsInCache this.max_finder_results", this.max_finder_results);
        console.log("AllTripsComponent->storeTripsInCache total_docs_cached > this.max_finder_results");
        
        break;
      }

      search_parameters["page"] = page as unknown as string;
      let url_parameters = this.searchParametersToUrlParameters(search_parameters);
      //console.log("url_parameters ", url_parameters);
      const url = this.tripsService.getUrl(url_parameters);

      urls.push(url);
    }
    //cache url prepare - end

    //cache store - start
    caches.delete(this.cacheName);
    caches.open(this.cacheName).then( cache => {
      cache.addAll(urls).then( () => {
        //console.log("Cached data from urls", urls)
      });
    });
    //cache store - end
  }

  finderFormValidToCreateFinder(): boolean
  {
    let formData = this.searchTripForm.value;
    let finderFormValidToCreateFinder = false;
    let keyWord = formData.keyWord;
    let priceLowerBound = formData.priceLowerBound == "" ? null : formData.priceLowerBound ;
    let priceUpperBound = formData.priceUpperBound == "" ? null : formData.priceUpperBound ;
    let dateLowerBound = formData.dateLowerBound;
    let dateUpperBound = formData.dateUpperBound;

    let finder_exists = false;
    if(typeof this.finders != 'undefined' && this.finders != null && this.finders.length > 0)
    {
      //console.log("AllTripsComponent->finderFormValidToCreateFinder this.finders", this.finders);

      let finders_filtered = this.finders.filter((currentFinder: Finder) => {

        return (
          currentFinder.getKeyWord() == keyWord 
          && currentFinder.getPriceLowerBound() == priceLowerBound 
          && currentFinder.getPriceUpperBound() == priceUpperBound 
          && currentFinder.getDateLowerBoundStringYmd() == dateLowerBound 
          && currentFinder.getDateUpperBoundStringYmd() == dateUpperBound
        );

      });
      //console.log("AllTripsComponent->finderFormValidToCreateFinder finders_filtered ", finders_filtered);

      if(finders_filtered.length > 0)
      {
        console.log("AllTripsComponent->finderFormValidToCreateFinder finder exists ", finders_filtered);
        finder_exists = true;
      }

    }

    //only creates the finder if at least one search criterion has been stablished
    // and finder doesn't exist
    if(
      (
        formData["keyWord"] != "" || 
        (formData["priceLowerBound"] != "" && formData["priceUpperBound"] != "") ||
        (formData["dateLowerBound"] != "" && formData["dateUpperBound"] != "")
      )
      && 
      finder_exists == false
    )
    {
      finderFormValidToCreateFinder = true;
    }

    console.log("AllTripsComponent->finderFormValidToCreateFinder finderFormValidToCreateFinder ", finderFormValidToCreateFinder);

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

    //only save search parameters, not results
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
      this.create_finder_sucess_message = "finders.messages.finder-saved";

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
        this.search();
      }
      else if(status == 200)//finder found
      {
        this.showSaveFinderButton = false;
        
        //let responseBody = response.body;
        let json_finders = response.body
        //console.log("AllTripsComponent->getExplorerFinders json_finders", json_finders);
        let casted_finders = Finder.castJsonFinders(json_finders);
        //console.log("AllTripsComponent->getExplorerFinders casted_finders", casted_finders);
        this.finders = casted_finders;
        //console.log("AllTripsComponent->getExplorerFinders this.finders", this.finders);
        
        let finder: Finder;

        //console.log("AllTripsComponent->getExplorerFinders this.finder_id ", this.finder_id);        

        if(this.finder_id != null && typeof this.finder_id !== 'undefined' && this.finder_id !== '')
        {
          //console.log("AllTripsComponent->getExplorerFinders this.finder_id", this.finder_id);
          //console.log("AllTripsComponent->getExplorerFinders this.finders ", this.finders);

          let finders_filtered = this.finders.filter((currentFinder) => {
            return currentFinder._id == this.finder_id;
          });
          //console.log("AllTripsComponent->getExplorerFinders finders_filtered ", finders_filtered);

          if(finders_filtered.length > 0)
          {
            finder = finders_filtered[0];
          }
          else
          {
            //lastFinder
            finder = this.finders[0];
          }
        }
        else
        {
          //lastFinder
          finder = this.finders[0];
        }

        let keyWord = finder.getKeyWord();
        if(keyWord !== "" && keyWord !== null)
        {
          this.searchTripForm.controls.keyWord.setValue(keyWord);
        }

        let priceLowerBound = finder.getPriceLowerBound();
        if(priceLowerBound !== null)
        {
          this.searchTripForm.controls.priceLowerBound.setValue(priceLowerBound);
        }

        let priceUpperBound = finder.getPriceUpperBound();
        if(priceUpperBound !== null)
        {
          this.searchTripForm.controls.priceUpperBound.setValue(priceUpperBound);
        }

        let dateLowerBound = finder.getDateLowerBoundStringYmd();
        //console.log("AllTripsComponent->getExplorerFinders dateLowerBound ", dateLowerBound);
        if(dateLowerBound != "")
        {
          this.searchTripForm.controls.dateLowerBound.setValue(dateLowerBound);
        }

        let dateUpperBound = finder.getDateUpperBoundStringYmd();
        if(dateUpperBound != "")
        {
          this.searchTripForm.controls.dateUpperBound.setValue(dateUpperBound);
        }

        /*
        let results = finder.getResults();
        if(results != null && results.length > 0)
        {
          let json_trips = finder.results;
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

  convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    return newDate;   
  }

  diffInHours(date1, date2)
  {
    var hours = Math.abs(date1 - date2) / 36e5;
    return hours;
  }

  addTriptoTracking(trip:Trip):void{

    let trackTrip:trackTrip = {
      id: trip._id,
      title: trip.getTitle(),
      price: trip.getPrice(),
      currentDate: new Date().toISOString()
    }

    let trackingTrips:trackTrip[] = JSON.parse(localStorage.getItem("trackingTripsList"));

    if(trackingTrips){
      trackingTrips.push(trackTrip)
    }else{
      trackingTrips = []
      trackingTrips.push(trackTrip)
    }

    localStorage.setItem("trackingTripsList",JSON.stringify(trackingTrips))
  }

  removeTripFromTracking(trip:Trip):void{

    let trackingTrips:trackTrip[] = JSON.parse(localStorage.getItem("trackingTripsList"));

    if(trackingTrips){
      trackingTrips = trackingTrips.filter((trackingTrip)=>{
        return trackingTrip.id != trip._id
      })
    }
    localStorage.setItem("trackingTripsList",JSON.stringify(trackingTrips))

  }

  verifyTripIsTracked(trip:Trip):boolean{
    let tripIsTracked:boolean = false;
    let trackingTrips:trackTrip[] = JSON.parse(localStorage.getItem("trackingTripsList"));

    if(trackingTrips){
      trackingTrips = trackingTrips.filter((trackingTrip)=>{
        return trackingTrip.id == trip._id
      })
      if(trackingTrips.length > 0){
        tripIsTracked = true;
      }
    }
    return tripIsTracked
  }
}
