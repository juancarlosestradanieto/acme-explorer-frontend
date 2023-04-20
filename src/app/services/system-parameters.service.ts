import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemParametersService {

  constructor(private http: HttpClient) { }

  getSystemParameters() {
    const url = `${environment.backendApiBaseURL + '/systemParameters'}`;

    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };

    return new Promise<any>((resolve, reject) => {

      this.http.get<any>(url, httpOptions)
        .subscribe({
          next: (response) => {

            console.log('SystemParametersService->getSystemParameters get next response', response);
            resolve(response);

          },
          error: (error) => {

            console.error('SystemParametersService->getSystemParameters get error', error);
            reject(error);

          }
        });

    });

  }

  createSystemParameters(systemParameters: any) {
    const url = `${environment.backendApiBaseURL + '/systemParameters'}`;

    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };

    const body = JSON.stringify(systemParameters);

    return new Promise<any>((resolve, reject) => {

      this.http.post<any>(url, body, httpOptions)
        .subscribe({
          next: (response) => {

            console.log('SystemParametersService->createSystemParameters get next response', response);
            resolve(response);

          },
          error: (error) => {

            console.error('SystemParametersService->createSystemParameters get error', error);
            reject(error);

          }
        });

    });

  }

  updateSystemParameters(systemParameters: any) {
    const url = `${environment.backendApiBaseURL + '/systemParameters'}`;

    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };

    const body = JSON.stringify(systemParameters);

    return new Promise<any>((resolve, reject) => {

      this.http.put<any>(url, body, httpOptions)
        .subscribe({
          next: (response) => {

            console.log('SystemParametersService->createSystemParameters get next response', response);
            resolve(response);

          },
          error: (error) => {

            console.error('SystemParametersService->createSystemParameters get error', error);
            reject(error);

          }
        });

    });

  }
}
