import { Component, OnInit } from '@angular/core';

import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  trips_by_manager: any = [];
  applications_by_trip: any = [];
  price_of_trips: any = [];
  applications_by_status: any = [];
  price_range_in_finder: any = [];
  top10_in_finder: any = [];
  dashboard_loaded!: Promise<boolean>;
  minimum:number;
  maximum:number;
  promedio:number;

  constructor(private dashboardService: DashboardService) { }

  getLatestDashboard() {
    this.dashboardService.getDashboard()
      .then((response: any) => {

        console.log("DashboardComponent->constructor dashboardService.getDashboard then response ", response);
        console.log("DashboardComponent->constructor dashboardService.getDashboard then response.dashboard[0] ", response.dashboard[0]);

        this.trips_by_manager = response.dashboard[0].tripsPerManager;
        this.applications_by_trip = response.dashboard[0].applicationsPerTrip;
        this.price_of_trips = response.dashboard[0].priceOfTrips;
        let applicationsRatioPerStatus = response.dashboard[0].applicationsRatioPerStatus;
        console.log("DashboardComponent->constructor dashboardService.getDashboard then applicationsRatioPerStatus ", applicationsRatioPerStatus);
        this.applications_by_status["CANCELLED"] = applicationsRatioPerStatus.find((ratio: any) => ratio.status == "CANCELLED");
        this.applications_by_status["REJECTED"] = applicationsRatioPerStatus.find((ratio: any) => ratio.status == "REJECTED");
        this.applications_by_status["PENDING"] = applicationsRatioPerStatus.find((ratio: any) => ratio.status == "PENDING");
        this.applications_by_status["DUE"] = applicationsRatioPerStatus.find((ratio: any) => ratio.status == "DUE");
        this.applications_by_status["ACCEPTED"] = applicationsRatioPerStatus.find((ratio: any) => ratio.status == "ACCEPTED");

        console.log("DashboardComponent->constructor dashboardService.getDashboard then this.trips_by_manager ", this.trips_by_manager);
        console.log("DashboardComponent->constructor dashboardService.getDashboard then this.applications_by_trip ", this.applications_by_trip);
        console.log("DashboardComponent->constructor dashboardService.getDashboard then this.price_of_trips ", this.price_of_trips);
        console.log("DashboardComponent->constructor dashboardService.getDashboard then this.applications_by_status ", this.applications_by_status);

        this.dashboard_loaded = Promise.resolve(true);
      })
      .catch((error: any) => {

        this.dashboard_loaded = Promise.resolve(false);

        console.error("DashboardComponent->constructor dashboardService.getDashboard catch ", error);

      });
  }

  ngOnInit(): void {
    this.getLatestDashboard();
    this.getPriceRangeAndTop10KeyWords();
    
  }

  // getTop10WordsFinder():void{
  //   this.dashboardService.getTop10KeyWords().subscribe((res)=>{
  //     this.top10_in_finder= res;
  //     console.log("Dashboard.component ->getTop10WordsFinder()",res)
  //   });
  // }

  // getAveragePriceFinders():void{
  //   this.dashboardService.getAveragePriceFinders().subscribe((res)=>{
  //     this.price_range_in_finder = [res.normal,res.positive,res.decimal];
  //     console.log("Dashboard.component -> getAveragePriceFinders() ",res);
  //   })
  //}

  getPriceRangeAndTop10KeyWords():void{

    this.dashboardService.getPriceRangeAndTop10KeyWords().subscribe((data)=>{
      console.log("Esto es lo que devuelve el metodo tocho este: ",data)
      this.minimum = data[0].lowerPrice
      this.maximum = data[0].upperPrice;
      this.promedio= (data[0].lowerPrice + data[0].upperPrice)/2; //Backend no devuelve un valor promedio como tal. Hacemos la media
      console.log("lowerprice: ",data[0].lowerPrice)
      console.log("upperprice: ",data[0].upperPrice)
      console.log("promedio : ",this.promedio)
      const array_top_finders = data[0].topKeyWords.slice(0,10).map(keyword => keyword._id);
      this.top10_in_finder = array_top_finders.filter((keyword)=>{ return keyword !== ""})
      console.log("estas son las key words", this.top10_in_finder)



    })
  }

}
