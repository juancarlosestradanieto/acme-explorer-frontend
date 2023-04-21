import { Component, OnInit } from '@angular/core';
import { Sponsorship } from 'src/app/models/sponsorship.model';
import { SponsorshipsService } from 'src/app/services/sponsorships.service';

@Component({
  selector: 'app-all-sponsorships',
  templateUrl: './all-sponsorships.component.html',
  styleUrls: ['./all-sponsorships.component.scss']
})
export class AllSponsorshipsComponent implements OnInit {


  sponsorships!:Sponsorship[];
  isPayed!:boolean

  constructor(private _sponsorshipsService:SponsorshipsService) { }

  ngOnInit(): void {
    this.getAllSponsorships();
  }

  getAllSponsorships(){
    return this._sponsorshipsService.getAllSponsorships().subscribe((res)=>{
      this.sponsorships = res.sponsorships;
      console.log("Estos son los sponsorships?",this.sponsorships)
    })
  }


}
