import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  trips_by_manager:any = [];
  applications_by_trip:any = [];
  price_of_trips:any = [];
  applications_by_status:any = [];
  price_range_in_finder:any = [];
  top10_in_finder:any = [];

  constructor(private dashboardService: DashboardService) { }

  getLatestDashboard() {
    this.dashboardService.getDashboard()
      .then((response: any) => {

      console.log("DashboardComponent->constructor dashboardService.getDashboard then response ", response);

    })
    .catch((error: any) => {

        console.error("DashboardComponent->constructor dashboardService.getDashboard catch ", error);

    });
  }

  ngOnInit(): void {
    this.getLatestDashboard();
  }

}
