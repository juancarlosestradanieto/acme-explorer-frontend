import { Component, OnInit } from '@angular/core';
import { tripPreCanceled } from 'src/app/interfaces/tripPreCanceled';

@Component({
  selector: 'app-pre-cancel',
  templateUrl: './pre-cancel.component.html',
  styleUrls: ['./pre-cancel.component.scss']
})
export class PreCancelComponent implements OnInit {

  preCancelTrips:tripPreCanceled[]

  constructor() { }

  ngOnInit(): void {
    this.preCancelTrips = JSON.parse(localStorage.getItem("preCanceledTripsList"))
  }

}
