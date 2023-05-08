import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SponsorshipsService } from 'src/app/services/sponsorships.service';
import { create } from 'ts-node';

@Component({
  selector: 'app-add-sponsorship',
  templateUrl: './add-sponsorship.component.html',
  styleUrls: ['./add-sponsorship.component.scss']
})
export class AddSponsorshipComponent implements OnInit {

  sponsorshipForm!:FormGroup
  success_message!:string;
  error_message!:string;
  sponsorID!:string;

  constructor( 
    private _fb:FormBuilder,
    private route:ActivatedRoute,
    private _sponsorshipService:SponsorshipsService,
    private _router:Router,
    private _translateService: TranslateService,
    private _location:Location) 
    
    { 
      this.sponsorID = this.route.snapshot.params['id']
      console.log("console desde constructor",this.sponsorID);

      this.sponsorshipForm = this._fb.group({
        sponsor_Id: [this.sponsorID],
        tripTicker: ["AMR-23",Validators.required],
        page: ["https://www.astonmartinf1.com/en-GB/",Validators.required],
        banner: ["https://www.palco23.com/files/2020/19_redaccion/competiciones/motor/formula%201/aston-martin-cognizant-728.jpg",Validators.required],
        isPayed: [false]
        
      })
      
    }

  ngOnInit(): void {
  }

  onSubmit(){
    this._sponsorshipService.createSponsorship(this.sponsorshipForm.value).subscribe(res =>{

      console.log("Esto es el res tras hacer submit: ",res);
      this._translateService.get('sponsorships.operation_successfull').subscribe((res: string) => {
        alert(res);
      });
      this._location.back();
     
    });
  }

}
