import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Trip } from 'src/app/models/trip.model';
import { PreCancelledTripsService } from 'src/app/services/pre-cancelled-trips/pre-cancelled-trips.service';
import { TripsService } from 'src/app/services/trips/trips.service';

@Component({
  selector: 'app-pre-cancelled-trips',
  templateUrl: './pre-cancelled-trips.component.html',
  styleUrls: ['./pre-cancelled-trips.component.scss']
})
export class PreCancelledTripsComponent implements OnInit {

  preCancelledTrips: Array<Trip>;
  currentDateTime: Date;
  success_messages: any = {};
  error_messages: any = {};

  constructor(
    private translate:TranslateService, 
    private tripService: TripsService,
    private preCancelledTripsService: PreCancelledTripsService
  ) {
    this.currentDateTime = new Date;
  }

  ngOnInit(): void {
    this.getPreCancelledTrips();
  }

  getPreCancelledTrips(){
    let preCancelledTrips = JSON.parse(localStorage.getItem("preCancelledTrips"));
    
    if(preCancelledTrips)
    {
      this.preCancelledTrips = Trip.castJsonTrips(preCancelledTrips);
    }
  }

  getNowAndStartDateDiffInDays(trip: Trip)
  {
    return this.getDiffDays(trip.getStartDate().toString(), this.currentDateTime.toISOString());
  }

  getDiffDays(start: string, now: string) {
    var startDate = new Date(start);
    var endDate = new Date(now);

    var difference = startDate.getTime() - endDate.getTime();
    return difference / (1000 * 3600 * 24);
  }

  cancelAllTrips()
  {

    this.translate.get('pre-cancelled-trips.confirm-cancel-all-trips')
    .subscribe((message: string) => {

      if (confirm(message)) 
      {

        this.translate.get('trips.messages.cancel-trip-reason-request')
        .subscribe((message2: string) => {
    
          let cancelReason = prompt(message2);
    
          if (cancelReason == null || cancelReason == "")
          {
            //User cancelled the prompt"
          }
          else
          {
            this.preCancelledTrips.filter((currentTrip) => {
              console.log("currentTrip.id '"+currentTrip.id+"'");
    
              this.tripService.cancelTrip(currentTrip.id, cancelReason)
              .then((response) => {
      
                console.log("PreCancelledTripsComponent->cancelAllTrips then response ", response);

                if(response.hasOwnProperty("cancelReason") && response.hasOwnProperty("canceled"))
                {
                  let trip = Trip.castJsonTrip(response);
                  this.updatePreCancelledTripFromResponse(trip);
                }

                if(response.hasOwnProperty("message"))
                {
                  this.success_messages[currentTrip.id] = response.message; 
                }
                else
                {
                  this.translate.get('pre-cancelled-trips.successful-cancelation')
                  .subscribe((sucessful_cancelation_message: string) => {
                    this.success_messages[currentTrip.id] = sucessful_cancelation_message; 
                  });
                }
      
              })
              .catch((error) => {
      
                console.error("PreCancelledTripsComponent->cancelAllTrips catch ", error.error[0]);
                this.error_messages[currentTrip.id] = error.error[0]; 
                
              });
              
    
            });
          }
    
        });

      }

    });

  }

  updatePreCancelledTripFromResponse(trip: Trip)
  {
    this.preCancelledTripsService.updatePreCancelledTrip(trip);
    this.getPreCancelledTrips();
  }

  removeTripFromPreCancelledList(trip: Trip)
  {
    this.preCancelledTripsService.removeTripFromPreCancelledList(trip);
    this.getPreCancelledTrips();
  }

}
