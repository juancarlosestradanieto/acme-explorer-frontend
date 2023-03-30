import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  constructor(private http: HttpClient) { }

  createApplication(application: any, trip_id: string, explorer_id: string) {
    const url = `${environment.backendApiBaseURL + '/applications'}`;

    return new Promise<any>((resolve, reject) => {
      application.actor = explorer_id;
      application.trip = trip_id;
      application.comments = [];
      application.status = "PENDING";
  
      const body = JSON.stringify(application);
  
      this.http.post<any>(url, body, httpOptions).subscribe({
        next: (response) => {
          console.log('ApplicationsService->createApplication post next response', response);
          resolve(response);
        },
        error: (error) => {
          console.error('ApplicationsService->createApplication post error: ', error);
          reject(error);
        }
      });
    });
  }

  getAllApplications() {
    const url = `${environment.backendApiBaseURL + '/applications'}`;

    return new Promise<any>((resolve, reject) => {
      this.http.get<any>(url, httpOptions).subscribe({
        next: (response) => {
          console.log('ApplicationsService->getAllApplications get next response: ', response);
          resolve(response);
        },
        error: (error) => {
          console.error('ApplicationsService->getAllApplications get error: ', error);
          reject(error);
        }
      })
    });
  }

  getApplicationsByTripId(trip_id: string) {
    const url = `${environment.backendApiBaseURL + '/trips/' + trip_id + '/applications'}`;

    return new Promise<any>((resolve, reject) => {
      this.http.get<any>(url, httpOptions).subscribe({
        next: (response) => {
          console.log('ApplicationsService->getApplicationsByTripId get next response: ', response);
          resolve(response);
        },
        error: (error) => {
          console.error('ApplicationsService->getApplicationsByTripId get error: ', error);
          reject(error);
        }
      })
    });
  }

  getApplicationsByExplorerId(explorer_id: string) {
    const url = `${environment.backendApiBaseURL + '/actor/' + explorer_id + '/applications'}`;

    return new Promise<any>((resolve, reject) => {
      this.http.get<any>(url, httpOptions).subscribe({
        next: (response) => {
          console.log('ApplicationsService->getApplicationsByExplorerId get next response: ', response);
          resolve(response);
        },
        error: (error) => {
          console.error('ApplicationsService->getApplicationsByExplorerId get error: ', error);
          reject(error);
        }
      })
    });
  }

  getApplicationById(application_id: string) {
    const url = `${environment.backendApiBaseURL + '/applications' + application_id}`;

    return new Promise<any>((resolve, reject) => {
      this.http.get<any>(url, httpOptions).subscribe({
        next: (response) => {
          console.log('ApplicationsService->getApplicationById get next response: ', response);
          resolve(response);
        },
        error: (error) => {
          console.error('ApplicationsService->getApplicationById get error: ', error);
          reject(error);
        }
      })
    });
  }
}
