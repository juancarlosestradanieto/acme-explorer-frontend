import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Actor } from '../models/actor.model';

@Injectable({
  providedIn: 'root'
})


export class ActorsService {

  constructor(private _http: HttpClient) { }

  getActors(){
    const url = `${environment.backendApiBaseURL + "/actors"}`;

    const idToken = localStorage.getItem('idToken') ?? '';
    console.log("PANEL_ACTORES -> idToken del administrator actual: ",idToken)
  
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };
    return this._http.get<Actor[]>(url,httpOptions);

  }

}
