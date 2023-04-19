import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Actor } from '../models/actor.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ActorsService {

  constructor(private _http: HttpClient) { }

  getActors():Observable<Actor[]>{
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

  deleteActor(actorID:string):Observable<any>{
    const url = `${environment.backendApiBaseURL + '/actors/'+actorID}`;
    const idToken = localStorage.getItem('idToken') ?? '';
    console.log("PANEL_ACTORES -> idToken del administrator actual: ",idToken)
  
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };
    return this._http.delete<any>(url,httpOptions);
  }

  getActorById(actorID:string):Observable<Actor>{
    const url = `${environment.backendApiBaseURL + '/actors/'+actorID}`;
    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };
    return this._http.get<Actor>(url,httpOptions);
  }





}
