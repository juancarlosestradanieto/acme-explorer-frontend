import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Sponsorship } from '../models/sponsorship.model';
import { SponsorshipsResponse } from '../models/sponsorships-response.model';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Accept-Language': 'es'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class SponsorshipsService {

  constructor(private http: HttpClient) { }

  getSponsorshipsByTrip(ticker: string) {
    console.log("SponsorshipsService.getSponsorshipsByTrip ticker ", ticker);
    const url = `${environment.backendApiBaseURL + '/sponsorships/trips/' + ticker}`;

    console.log("SponsorshipsService.getSponsorshipsByTrip url ", url);

    return this.http.get<JSON>(url, httpOptions);

  }

  getSponsorshipsBySponsor(sponsorId: string) {
    console.log("SponsorshipsService.getSponsorshipsBySponsor sponsorId ", sponsorId);
    const url = `${environment.backendApiBaseURL + '/sponsorships/sponsors/' + sponsorId}`;
    console.log("SponsorshipsService.getSponsorshipsByTrip url ", url);
    return this.http.get<JSON>(url, httpOptions);
  }

  getAllSponsorships(){
    const url = `${environment.backendApiBaseURL+'/sponsorships/'}`;
    return this.http.get<any>(url);
  }

  deleteSponsorship(sponsorshipID:string):Observable<any>{
    const url = `${environment.backendApiBaseURL+'/sponsorships/'+sponsorshipID}`;
    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken':idToken
      }),
    };
  
    return this.http.delete(url,httpOptions)
  }

  createSponsorship(sponsorhip:Sponsorship):Observable<any>{
    const url = `${environment.backendApiBaseURL+'/sponsorships'}`;
    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken':idToken
      }),
    };
    const body = JSON.stringify(sponsorhip);

    console.log(body)
    return this.http.post<any>(url,body,httpOptions)
  }

  getSponsorshipById(sponsorshipID:string):Observable<any>{
    const url = `${environment.backendApiBaseURL+'/sponsorships/'+sponsorshipID}`;
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

  updateSponsorship(sponsorship:Sponsorship):Observable<Sponsorship>{
    const url = `${environment.backendApiBaseURL+'/sponsorships/'+sponsorship.id}`;
    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };
    const body = JSON.stringify(sponsorship);
    return this.http.put<Sponsorship>(url,body,httpOptions)
  }
}
