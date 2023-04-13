import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actor } from 'src/app/models/actor.model';
import { Application } from 'src/app/models/application.model';
import { Trip } from 'src/app/models/trip.model';
import { ApplicationsService } from 'src/app/services/applications.service';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips/trips.service';
import { differenceInMilliseconds } from 'date-fns';


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
  keyword: string = "";
  
  //Para el CountDown
  interval:any;
  out_time!:string;

  constructor(private tripsService: TripsService, private authService: AuthService) 
  {
    this.currentDateTime = new Date;
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

    if(this.keyword != "")
    {
      let keyword_parameter = {"keyword": this.keyword};
      search_parameters = {
        ...search_parameters,
        ...keyword_parameter
      };
    }

    console.log("search_parameters ", search_parameters);

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

        //console.log(this.getDiffDays(this.trips[0].start_date.toString(), this.currentDateTime.toISOString()))
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

  deleteTrip(trip: Trip) {
    console.log("deleteTrip", trip.id);

    if(confirm("Are you sure to delete?, this action can't be undone.")) 
    {

      this.tripsService.deleteTrip(trip.id)
      .then((response) => {

        console.log("AllTripsComponent->deleteTrip tripsService.deleteTrip then response ", response);
        alert(response.message);
        this.search();
        
      })
      .catch((error) => {

        console.error("AllTripsComponent->deleteTrip tripsService.deleteTrip catch ", error);
        alert("Something went wrong");

      });

    }
  }

  favouriteTrip(trip: Trip) {
    console.log("favouriteTrip user.email ", this.user!.getEmail());
    console.log("favouriteTrip user.email-favourites ", this.user!.getEmail() + "-favourites");
    let favourites = localStorage.getItem(this.user!.getEmail() + "-favourites");
    console.log("favouriteTrip " + this.user!.getEmail() + "-favourites ", favourites);
    if (!favourites) {
      let newFavourites = [];
      newFavourites.push(trip);
      console.log("favouriteTrip newFavourites ", newFavourites);
      localStorage.setItem(this.user!.getEmail() + "-favourites", JSON.stringify(newFavourites));
    }
    else {
      let storedFavourites: Trip[] = JSON.parse(localStorage.getItem(this.user!.getEmail() + "-favourites") || '{}');
      let existsInFavourites: boolean = storedFavourites.some(storedTrip => Trip.castJsonTrip(storedTrip).getTicker() === trip.getTicker());
      console.log("favouriteTrip trip is in storedFavourites ", existsInFavourites);
      if (existsInFavourites) {
        storedFavourites.forEach((storedTrip, index) => {
          if (Trip.castJsonTrip(storedTrip).getTicker() === trip.getTicker()) {
            storedFavourites.splice(index, 1);
          }
        });
        console.log("favouriteTrip storedFavourites ", storedFavourites);
        localStorage.setItem(this.user!.getEmail() + "-favourites", JSON.stringify(storedFavourites));
      } else {
        console.log("favouriteTrip storedFavourites ", storedFavourites);
        storedFavourites.push(trip);
        localStorage.setItem(this.user!.getEmail() + "-favourites", JSON.stringify(storedFavourites));
      }
    }
  }

  checkTripInFavourites(trip: Trip) {
    let result: boolean = false;
    console.log("favouriteTrip user.email ", this.user!.getEmail());
    console.log("favouriteTrip user.email-favourites ", this.user!.getEmail() + "-favourites");
    let favourites = localStorage.getItem(this.user!.getEmail() + "-favourites");
    console.log("favouriteTrip " + this.user!.getEmail() + "-favourites ", favourites);
    if (favourites) {
      let storedFavourites: Trip[] = JSON.parse(localStorage.getItem(this.user!.getEmail() + "-favourites") || '{}');
      let existsInFavourites: boolean = storedFavourites.some(storedTrip => Trip.castJsonTrip(storedTrip).getTicker() === trip.getTicker());
      console.log("favouriteTrip trip is in storedFavourites ", existsInFavourites);
      if (existsInFavourites) {
        result = true;
      }
    }
    return result;
  }

}
