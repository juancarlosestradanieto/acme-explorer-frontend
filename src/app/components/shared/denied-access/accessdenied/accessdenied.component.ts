import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accessdenied',
  templateUrl: './accessdenied.component.html',
  styleUrls: ['./accessdenied.component.css']
})
export class AccessdeniedComponent implements OnInit {

  protected url!: String;

  constructor(private route: ActivatedRoute) { 

  }

  ngOnInit(): void {
    this.url = location.origin + this.route.snapshot.queryParams['previousURL']
  }

}
