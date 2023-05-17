import { Injectable } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class PreCancelledTripsService {

  constructor() { }

  addTripToPreCancelledList(trip: Trip)
  {
    let tripData = trip;

    let preCancelledTrips = JSON.parse(localStorage.getItem("preCancelledTrips"));

    if(preCancelledTrips)
    {
      preCancelledTrips.push(tripData);
    }
    else
    {
      preCancelledTrips = [];
      preCancelledTrips.push(tripData);
    }
    localStorage.setItem("preCancelledTrips", JSON.stringify(preCancelledTrips));
  }

  removeTripFromPreCancelledList(trip: Trip)
  {
    let preCancelledTrips = JSON.parse(localStorage.getItem("preCancelledTrips"));
    preCancelledTrips = preCancelledTrips.filter((currentTrip) => {
      //console.log("currentTrip.id '"+currentTrip.id+"'");
      //console.log("trip._id '"+trip._id+"'");
      return currentTrip._id != trip._id;
    });
    localStorage.setItem("preCancelledTrips", JSON.stringify(preCancelledTrips));
  }

  tripIsPreCancelled(trip: Trip)
  {
    let preCancelledTrips = JSON.parse(localStorage.getItem("preCancelledTrips"));

    let tripIsPreCancelled = false;
    if(preCancelledTrips)
    {
      preCancelledTrips = preCancelledTrips.filter((currentTrip) => {
        //console.log("currentTrip.id '"+currentTrip.id+"'");
        //console.log("trip._id '"+trip._id+"'");
        return currentTrip._id == trip._id;
      });
      //console.log("preCancelledTrips ", preCancelledTrips);

      if(preCancelledTrips.length > 0)
      {
        tripIsPreCancelled = true;
      }
    }
    //console.log("tripIsPreCancelled ", tripIsPreCancelled);
    
    
    return tripIsPreCancelled;
  }

  updatePreCancelledTrip(trip: Trip)
  {
    let preCancelledTrips = JSON.parse(localStorage.getItem("preCancelledTrips"));

    console.log("trip", trip);

    preCancelledTrips = preCancelledTrips.map((currentTrip2) => {

      console.log("currentTrip2", currentTrip2);
      
      if(currentTrip2._id == trip.id)
      {
        return trip;
      }
      else
      {
        return currentTrip2;
      }
    });

    localStorage.setItem("preCancelledTrips", JSON.stringify(preCancelledTrips));

  }
}
