import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';

import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Accept-Language': 'es'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  trips: Array<Trip> = [];
  
  constructor(private http: HttpClient) { }

  getAllTrips(page: number)
  {
    const url = `${environment.backendApiBaseURL + '/trips?page='+page}`;

    return new Promise<any>((resolve, reject) => {

      this.http.get<any>(url, httpOptions)
      .subscribe({
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

  getSingleTrip(trip_id: string)
  {

    const url = `${environment.backendApiBaseURL + '/trips/'+trip_id}`;

    return new Promise<any>((resolve, reject) => {

      this.http.get<any>(url, httpOptions).subscribe({
        next: (response) => {
  
          console.log('TripsService->getSingleTrip get next response', response);
          resolve(response);
  
        },
        error: (error) => {
  
          console.error('TripsService->getSingleTrip get error', error);
          reject(error);
  
        }
      });
    
    });

  }

  createTrip(trip: any) {
    const url = `${environment.backendApiBaseURL + '/trips'}`;
    const idToken = localStorage.getItem('idToken') ?? '';

    //console.log("TripsService->createTrip idToken ", idToken);
    
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };

    return new Promise<any>((resolve, reject) => {

      const body = JSON.stringify(trip);

      this.http.post<any>(url, body, httpOptions).subscribe({
        next: (response) => {
          console.log('TripsService->createTrip post next response', response);
          resolve(response);
        },
        error: (error) => {
          console.error('TripsService->createTrip post error: ', error);
          reject(error);
        }
      });
      
    });

  }

  updateTrip(trip: any) {
    const url = `${environment.backendApiBaseURL + '/trips/'+trip.id}`;
    const idToken = localStorage.getItem('idToken') ?? '';

    //console.log("TripsService->createTrip idToken ", idToken);
    
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };

    return new Promise<any>((resolve, reject) => {

      const body = JSON.stringify(trip);

      this.http.put<any>(url, body, httpOptions).subscribe({
        next: (response) => {
          console.log('TripsService->updateTrip put next response', response);
          resolve(response);
        },
        error: (error) => {
          console.error('TripsService->updateTrip put error: ', error);
          reject(error);
        }
      });
      
    });

  }

}