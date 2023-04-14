import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Sponsorship } from '../models/sponsorship.model';
import { SponsorshipsResponse } from '../models/sponsorships-response.model';

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
}
