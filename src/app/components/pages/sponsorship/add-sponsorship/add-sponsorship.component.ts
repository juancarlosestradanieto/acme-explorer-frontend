import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private _router:Router
    ) 
    { 
      this.sponsorID = this.route.snapshot.params['id']
      console.log("console desde constructor",this.sponsorID);

      this.sponsorshipForm = this._fb.group({
        sponsor_Id: [this.sponsorID],
        tripTicker: ["",Validators.required],
        page: ["",Validators.required],
        banner: this._fb.array([this.getBanner()]),
        isPayed: [false]
        
      })
      
    }

  ngOnInit(): void {
  }

 
  private getBanner()
  {
    return this._fb.group({
      banner: [""],
    });
  }

  onAddBanner() {
    const control = <FormArray>this.sponsorshipForm.controls['banner'];
    control.push(this.getBanner());
  }

  onRemoveBanner(i: number) {
    const control = <FormArray>this.sponsorshipForm.controls['banner'];
    control.removeAt(i);
  }



  onSubmit(){
    // const sponsorShip = this.sponsorshipForm.value;
    // const formData = new FormData();
    // formData.append('sponsorship', JSON.stringify(sponsorShip));
    this._sponsorshipService.createSponsorship(this.sponsorshipForm.value).subscribe(res =>{
      console.log("Esto es el res tras hacer submit: ",res)
    })
    this._router.navigate([`actor/${this.sponsorID}/sponsorships`])
   
  }

  botonPrueba(){
    console.log(this.sponsorshipForm.controls)
  }
}
