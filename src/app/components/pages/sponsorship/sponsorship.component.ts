import { Component, OnInit } from '@angular/core';
import { Sponsorship } from 'src/app/models/sponsorship.model';
import { SponsorshipsService } from '../../../services/sponsorships.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sponsorship',
  templateUrl: './sponsorship.component.html',
  styleUrls: ['./sponsorship.component.scss']
})
export class SponsorshipComponent implements OnInit {

  sponsorships: Sponsorship[] = [];
  sponsorship!: Sponsorship;  
  sponsorships_loaded!: Promise<boolean>;
  id!:string;
  sponsorshipID!:string;
  



  constructor( private SponsorshipsService: SponsorshipsService,
               private route: ActivatedRoute,
               private _translateService:TranslateService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.sponsorshipID = this.route.snapshot.params['sponsorshipID']

    this.getSponsorships();
    console.log("¿Que id está cogiendo?:",this.id);
    
  }

  getSponsorships():Sponsorship[]{
    this.SponsorshipsService.getSponsorshipsBySponsor(this.id).subscribe(
      
      (response: any) => {
        console.log("SponsorshipComponent->constructor getSponsorshipsBySponsor response ", response);
        console.log("SponsorshipComponent->constructor getSponsorshipsBySponsor response.sponsorships ", response.sponsorships);
        if (response.error) {
          console.error(response.message);
        } else {
          this.sponsorships = response.sponsorships;
          console.log("SponsorshipComponent->constructor getSponsorshipsBySponsor length ", this.sponsorships.length);
          console.log("¿Coge los sponsorships;", this.sponsorships)
          // console.log("tripticker", this.sponsorships[0].getTripTicker())
        }
        
        if (this.sponsorships.length > 0) {
          console.log("SingleTripComponent->constructor getSponsorships Promise.resolve ", true);
          this.sponsorships_loaded = Promise.resolve(true);
        }
        else {
          console.log("SingleTripComponent->constructor getSponsorships Promise.resolve ", false);
          this.sponsorships_loaded = Promise.resolve(false);
        }
      }
    );
    
    
    return this.sponsorships;
  }


  deleteSponsorship(sponsorshipID: string) {
    this.SponsorshipsService.deleteSponsorship(sponsorshipID).subscribe(res=>{
      this.getSponsorships();
      alert(this._translateService.instant('sponsorships.operation_delete_successfull'));
      location.reload();
    }, error =>{
      alert(this._translateService.instant('sponsorships.operation_delete_successfull'));  
      location.reload();
      this.getSponsorships();
    });

  }


}
