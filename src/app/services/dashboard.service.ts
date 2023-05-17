import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  //*The average price range that explorers indicate in their finders.
  //*The top 10 key words that the explorers indicate in their finders.
  //*Al no disponer de un job en el backend que nos devuelvan dichos datos, se han tomado
  //*dos endpoints de APIs alojadas en la nube que devuelven palabras y números random

  //?The average price range that explorers indicate in their finders.
  // getTop10KeyWords():Observable<any>{
  //   const url="https://random-word-api.vercel.app/api?words=10";
  //   return this.http.get<any>(url);
  // }

  //  //?The average price range that explorers indicate in their finders.

  //   getAveragePriceFinders():Observable<any>{
  //     const url="https://random-data-api.com/api/number/random_number"
  //     return this.http.get<any>(url);
  //   }
  getPriceRangeAndTop10KeyWords():Observable<any>{
    const url = `${environment.backendApiBaseURL + "/finder/stats"}`;

    const idToken = localStorage.getItem('idToken') ?? '';

    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };

    return this.http.get<any>(url,httpOptions);

  }



}
