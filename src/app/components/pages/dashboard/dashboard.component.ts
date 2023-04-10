import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private trips_by_manager:any = [];
  private applications_by_trip:any = [];
  private price_of_trips:any = [];
  private applications_by_status:any = [];
  private price_range_in_finder:any = [];
  private top10_in_finder:any = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
  }

}
