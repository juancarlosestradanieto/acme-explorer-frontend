import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ExplorerStats, ExplorersStatsService } from '../../../services/explorers-stats/explorers-stats.service';

@Component({
  selector: 'app-explorer-stats',
  templateUrl: './explorers-stats.component.html',
  styleUrls: ['./explorers-stats.component.scss']
})
export class ExplorersStatsComponent implements OnInit {

  explorersStats;
  searchExplorersStatsForm;
  comparisonList: Array<string> = [
    "=",
    "!=",
    ">",
    ">=",
    "<",
    "<="
  ];
  startDate = null;
  endDate = null;
  startYear = null;
  startMonth = null;
  endYear = null;
  endMonth = null;
  explorerId = null;
  comparison = null;
  moneySpent = null;

  constructor(
    private explorersStatsService: ExplorersStatsService,
    private fb: FormBuilder
  ) 
  { 
    this.searchExplorersStatsForm = this.createForm();
  }

  ngOnInit(): void {

    this.getExplorersStats();

  }

  createForm()
  {
    return this.fb.group(
      {
        explorerId: [""],
        startDate: [""],
        endDate: [""],
        comparison: [""],
        moneySpent: [""],
      }
    );
  }

  search()
  {
    this.getExplorersStats();
  }

  getExplorersStats()
  {
    let formData = this.searchExplorersStatsForm.value;
    //console.log("formData ", formData);

    this.explorerId = formData.explorerId != "" ? formData.explorerId : null;
    this.startDate = formData.startDate != "" ? formData.startDate : null;
    this.endDate = formData.endDate != "" ? formData.endDate : null;
    this.comparison = formData.comparison != "" ? formData.comparison : null;
    this.moneySpent = formData.moneySpent != "" ? formData.moneySpent : null;

    if(this.startDate != null && this.endDate != null)
    {
      let startDateObj = new Date(this.startDate)
      this.startYear = startDateObj.getUTCFullYear();
      this.startMonth = startDateObj.getUTCMonth() + 1;
      //console.log("this.startYear ", this.startYear);
      //console.log("this.startMonth ", this.startMonth);

      let endDateObj = new Date(this.endDate)
      this.endYear = endDateObj.getUTCFullYear();
      this.endMonth = endDateObj.getUTCMonth() + 1;
      //console.log("this.endYear ", this.endYear);
      //console.log("this.endMonth ", this.endMonth);
    }
    else
    {
      this.startYear = null;
      this.startMonth = null;
      this.endYear = null;
      this.endMonth = null;
    }

    this.explorersStatsService.getExplorersStats()
    .then((response: any) => {

      console.log("ExplorerStatsComponent->getExplorersStats then response ", response);
      //let explorersStats = response.body as Array<ExplorerStats>;
      let jsonExplorersStats = response.body;

      let explorersStats: Array<ExplorerStats> = jsonExplorersStats.map((jsonExplorerStats: any) => {
        return jsonExplorerStats as ExplorerStats;
      });

      if(this.explorerId != null)
      {
        explorersStats = explorersStats.filter((explorerStats) => {
          return explorerStats.explorerId == this.explorerId;
        });
      }
      //console.log("explorersStats", explorersStats);

      this.explorersStats = explorersStats;

    })
    .catch((error: any) => {

      console.error("ExplorerStatsComponent->getExplorersStats catch ", error);

    });
  }

  showMonth(month)
  {
    return (
      (this.startMonth == null && this.endMonth == null)
      ||
      (this.startMonth == null && this.endMonth != null)
      ||
      (this.startMonth != null && this.endMonth == null)
      ||
      (
        this.startMonth != null && this.endMonth != null 
        && 
        month >= this.startMonth && month <= this.endMonth
      )
    );
  }

  showYear(year)
  {
    //return true;
    return (
      (this.startYear == null && this.endYear == null)
      ||
      (this.startYear == null && this.endYear != null)
      ||
      (this.startYear != null && this.endYear == null)
      ||
      (
        this.startYear != null && this.endYear != null 
        && 
        year >= this.startYear && year <= this.endYear
      )
    );
  }

  showMoneySpent(moneySpent)
  {
    //return true;
    return (
      (this.comparison == null && this.moneySpent == null)
      ||
      (this.comparison == null && this.moneySpent != null)
      ||
      (this.comparison != null && this.moneySpent == null)
      ||
      (
        this.comparison != null && this.moneySpent != null && 
        eval(this.moneySpent+" "+this.comparison+" "+moneySpent )
      )
    );
  }


}
