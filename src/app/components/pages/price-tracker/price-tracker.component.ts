import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { TripsService } from '../../../services/trips/trips.service';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrls: ['./price-tracker.component.scss']
})
export class PriceTrackerComponent implements OnInit {

  trips:Trip[]= []

  constructor(private TripsService:TripsService) { }

  ngOnInit(): void {
  }



}
