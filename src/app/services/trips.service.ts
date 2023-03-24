import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trip } from '../models/trip.model';

import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  trips: Array<Trip> = [];
  
  constructor(private http: HttpClient) { }

  getAllTrips()
  {
    const url = `${environment.backendApiBaseURL + '/trips'}`;

    return new Promise<any>((resolve, reject) => {

      this.http.get<any>(url, httpOptions).subscribe({
        next: (response) => {
  
          console.log('TripsService->getAllTrips get next response', response);
          resolve(response);
  
        },
        error: (error) => {
  
          console.error('TripsService->getAllTrips get error', error);
          reject(error);
  
        }
      });
    
    });

  }

}
