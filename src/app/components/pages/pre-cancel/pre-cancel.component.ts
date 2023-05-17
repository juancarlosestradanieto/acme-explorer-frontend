import { Component, OnInit } from '@angular/core';
import { tripPreCanceled } from 'src/app/interfaces/tripPreCanceled';
import { TripsService } from 'src/app/services/trips/trips.service';

@Component({
  selector: 'app-pre-cancel',
  templateUrl: './pre-cancel.component.html',
  styleUrls: ['./pre-cancel.component.scss']
})
export class PreCancelComponent implements OnInit {

  preCancelTrips:tripPreCanceled[] = [];
  currentDateTime: Date = new Date();
  

  constructor(private _tripsService:TripsService) { }

  ngOnInit(): void {
    this.getPrecancelTrips();
    console.log(this.getPrecancelTrips)
  }

  getPrecancelTrips(){
    this.preCancelTrips = JSON.parse(localStorage.getItem("preCanceledTripsList"))
  }

  getDiffDays(start: string, now: string) {
    var startDate = new Date(start);
    var endDate = new Date(now);

    var difference = startDate.getTime() - endDate.getTime();
    return difference / (1000 * 3600 * 24);
  }

  getNowAndStartDateDiffInDays(tripPreCanceled: tripPreCanceled):boolean{
    let esMenor7dias = false
   
  
    if( this.getDiffDays(tripPreCanceled.startDate.toString(), this.currentDateTime.toISOString()) <7){
       esMenor7dias = true;
    }else {
       esMenor7dias = false
    }
    return esMenor7dias
  }

  cancelTrip(preCancelTrips:tripPreCanceled[]){

    preCancelTrips.forEach((preCancelTrip:tripPreCanceled)=>{
      window.alert("A continuación se cancelará el viaje: "+preCancelTrip.title)
      this._tripsService.cancelTrip(preCancelTrip.id, "cancelReason").then((response) => {  
      preCancelTrip.canceled = true;
      this.preCancelTrips.push(preCancelTrip);
      localStorage.setItem("preCanceledTripsList",JSON.stringify(this.preCancelTrips))
       console.log(response.message);
      })
      .catch((error) => {
       console.log(error);
      });
    })
    location.reload();
  }
  

}
