import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Application } from '../models/application.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',
  'Accept-Language': 'es' }),
};

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  constructor(private http: HttpClient) { }

  createApplication(application: any) {
    console.log("ApplicationsService->createApplication application.comments ", application.comments);
    let commentsString: string = application.comments.map((comment: string) => comment).join("[/||/]");
    console.log("ApplicationsService->createApplication string application.comments ", commentsString);
    application.comments = commentsString;

    const url = `${environment.backendApiBaseURL + '/applications'}`;

    const idToken = localStorage.getItem('idToken') ?? '';

    console.log("ApplicationsService->createApplication idToken ", idToken);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken
      }),
    };

    return new Promise<any>((resolve, reject) => {

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

    const idToken = localStorage.getItem('idToken') ?? '';

    console.log("ApplicationsService->getAllApplications idToken ", idToken);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken
      }),
    };

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

  async getApplicationsByTripId(trip_id: string) {
    const url = `${environment.backendApiBaseURL + '/trips/' + trip_id + '/applications'}`;

    const idToken = localStorage.getItem('idToken') ?? '';

    console.log("ApplicationsService->getAllApplications idToken ", idToken);

    let queryParams = new HttpParams();
    queryParams = queryParams.append("trip", trip_id);

    const httpOptionsByTrip = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken
      }),
      params: queryParams
    };

    return new Promise<any>((resolve, reject) => {
      //this.http.get<any>(url, httpOptions).subscribe({
      this.http.get<any>(url, httpOptionsByTrip).subscribe({
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
    const url = `${environment.backendApiBaseURL + '/applications/explorer/' + explorer_id}`;


    const idToken = localStorage.getItem('idToken') ?? '';

    console.log("ApplicationsService->getApplicationsByExplorerId idToken ", idToken);

    let queryParams = new HttpParams();
    queryParams = queryParams.append("explorer_Id", explorer_id);

    const httpOptionsByExplorer = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken
      }),
      params: queryParams
    };

    return new Promise<any>((resolve, reject) => {
      //this.http.get<any>(url, httpOptions).subscribe({
      this.http.get<any>(url, httpOptionsByExplorer).subscribe({
        next: (response) => {
          console.log('ApplicationsService->getApplicationsByExplorerId get next response: ', response);
          console.log('ApplicationsService->getAllApplications get next response[0]: ', response[0]);
          console.log('ApplicationsService->getAllApplications get next response[0].id: ', response[0].id);
          console.log('ApplicationsService->getAllApplications get next response[0].actor: ', response[0].actor);
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
    const url = `${environment.backendApiBaseURL + '/applications/' + application_id}`;

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

  cancelApplication(application_id: string) {
    const url = `${environment.backendApiBaseURL + '/applications/' + application_id + '/cancel'}`;

    const idToken = localStorage.getItem('idToken') ?? '';

    console.log("ApplicationsService->cancelApplication idToken ", idToken);

    const httpOptionsStatus = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken
      }),
    };

    httpOptions.headers.set('idToken', idToken);

    return new Promise<any>((resolve, reject) => {
      this.http.patch<any>(url, {}, httpOptions).subscribe({
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

  rejectApplication(application_id: string, rejection_reason: any) {
    const url = `${environment.backendApiBaseURL + '/applications/' + application_id + '/reject'}`;

    const idToken = localStorage.getItem('idToken') ?? '';

    console.log("ApplicationsService->rejectApplication idToken ", idToken);

    const httpOptionsStatus = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken
      }),
    };

    return new Promise<any>((resolve, reject) => {
      this.http.patch<any>(url, {rejected_reason: rejection_reason}, httpOptionsStatus).subscribe({
        next: (response) => {
          console.log('ApplicationsService->rejectApplication get next response: ', response);
          resolve(response);
        },
        error: (error) => {
          console.error('ApplicationsService->rejectApplication get error: ', error);
          reject(error);
        }
      });
    });
  }

  acceptApplication(application_id: string) {
    const url = `${environment.backendApiBaseURL + '/applications/' + application_id + '/due'}`;

    const idToken = localStorage.getItem('idToken') ?? '';

    console.log("ApplicationsService->acceptApplication idToken ", idToken);

    const httpOptionsStatus = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken
      }),
    };

    return new Promise<any>((resolve, reject) => {
      this.http.patch<any>(url, {}, httpOptionsStatus).subscribe({
        next: (response) => {
          console.log('ApplicationsService->acceptApplication get next response: ', response);
          resolve(response);
        },
        error: (error) => {
          console.error('ApplicationsService->acceptApplication get error: ', error);
          reject(error);
        }
      });
    });
  }
}

