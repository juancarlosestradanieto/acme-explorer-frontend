import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Finder } from 'src/app/models/finder/finder.model';

@Injectable({
  providedIn: 'root'
})
export class FindersService {

  constructor(private http: HttpClient) { }

  createFinder(finder: any) {

    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };

    const url = `${environment.backendApiBaseURL + '/finder'}`;

    return new Promise<any>((resolve, reject) => {

      const body = JSON.stringify(finder);

      this.http.post<any>(url, body, httpOptions).subscribe({
        next: (response) => {
          console.log('FindersService->createFinder post next response', response);
          resolve(response);
        },
        error: (error) => {
          console.error('FindersService->createFinder post error: ', error);
          reject(error);
        }
      });
      
    });

  }

  getSingleFinder(explorer_Id: string)
  {

    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };

    const url = `${environment.backendApiBaseURL + '/finder/explorer/'+explorer_Id}`;

    return new Promise<any>((resolve, reject) => {

      this.http.get<any>(url, httpOptions).subscribe({
        next: (response) => {
  
          console.log('FindersService->getSingleFinder get next response', response);
          resolve(response);
  
        },
        error: (error) => {
  
          console.error('FindersService->getSingleFinder get error', error);
          reject(error);
  
        }
      });
    
    });

  }
}
