import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface MonthExpense {
  moneySpent: number;
  month: number;
  year: number;
  _id: string;
}

export interface YearExpense {
  moneySpent: number;
  year: number;
  _id: string;
}

export interface ExplorerStats {
  explorerId: string;
  monthExpense: Array<MonthExpense>;
  yearExpense: Array<YearExpense>;
  _id: string;
}




@Injectable({
  providedIn: 'root'
})
export class ExplorersStatsService {

  constructor(private http: HttpClient) { }


  getExplorersStats()
  {
    let startYear = 2021;
    let startMonth = 1;
    let endYear = 2023;
    let endMonth = 12;

    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions : Object = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
      observe: "response",
    };

    const url = `${environment.backendApiBaseURL + '/explorerStats/'+startYear+'/'+startMonth+'/'+endYear+'/'+endMonth}`;

    return new Promise<any>((resolve, reject) => {

      this.http.get<any>(url, httpOptions).subscribe({
        next: (response) => {
  
          console.log('ExplorerStatsService->getExplorersStats get next response', response);
          resolve(response);
  
        },
        error: (error) => {
  
          console.error('ExplorerStatsService->getExplorersStats get error', error);
          reject(error);
  
        }
      });
    
    });

  }
}
