import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TripsService } from '../services/trips/trips.service';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerApplicationsGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private tripService: TripsService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise(async (resolve, reject) => {
      const expectedRole = 'MANAGER';
      const currentActor = this.authService.getCurrentActor();
      let result = false;
      if (currentActor) {
        const activeRole = new RegExp(currentActor.getRole().toString(), 'i');
        if (expectedRole.search(activeRole) !== -1) {
          let json_trip;
          let trip: Trip;
          const tripIdInPath = route.params['id'] || '';

          await this.tripService.getSingleTrip(tripIdInPath)
            .then((response) => {
              json_trip = response;
              trip = Trip.castJsonTrip(json_trip);
              if (trip.getManagerId() == currentActor.id) {
                result = true;
                console.log("Correcto")
              } 
            }).catch((error) => {

            });
        } 
        if (!result) {
          this.router.navigate(['denied-access'],
            { queryParams: { previousURL: state.url } });
        }
        console.log("En camino de resolver")
        resolve(result);
      } else {
        if (expectedRole.indexOf('anonymous') !== -1) {
          result = true;
        } else {
          this.router.navigate(['login'],
            { queryParams: { returnUrl: state.url } })
        }
        resolve(result);
      }
    });
  }
}

