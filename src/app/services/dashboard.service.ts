import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboard() {
    const url = `${environment.backendApiBaseURL + "/dashboardInformation/latest"}`;

    const idToken = localStorage.getItem('idToken') ?? '';

    console.log("DashboardService->getDashboard idToken ", idToken);

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

          console.log('DashboardService->getDashboard get next response', response);
          resolve(response);
        },
        error: (error) => {

          console.error('DashboardService->getDashboard get error', error);
          reject(error);
        }
      });

    });
  }
}
