import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-go-back-button',
  templateUrl: './go-back-button.component.html',
  styleUrls: ['./go-back-button.component.scss']
})
export class GoBackButtonComponent implements OnInit {

  constructor(private _location:Location) { }

  ngOnInit(): void {
  }

  goBack(){
    this._location.back();
  }

}
