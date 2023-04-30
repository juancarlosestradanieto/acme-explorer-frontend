import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Sponsorship } from 'src/app/models/sponsorship.model';
import { SponsorshipsService } from 'src/app/services/sponsorships.service';

@Component({
  selector: 'app-detail-sponsorship',
  templateUrl: './detail-sponsorship.component.html',
  styleUrls: ['./detail-sponsorship.component.scss']
})
export class DetailSponsorshipComponent implements OnInit {

  sponsorship!:Sponsorship;
  sponsorship_id:string;

  constructor(
    private _sponsorshipsService:SponsorshipsService,
    private _activatedRoute:ActivatedRoute
    ) { 
      this.sponsorship_id= this._activatedRoute.snapshot.params['id']
    }

  ngOnInit(): void {
    console.log(this.sponsorship_id)
    this.getSponsorshipbyId(this.sponsorship_id);
  }

  getSponsorshipbyId(sponsorshipId:string){
    this._sponsorshipsService.getSponsorshipById(sponsorshipId).subscribe(res=>{
      this.sponsorship = res.sponsorship;
    })
    
  }

}
