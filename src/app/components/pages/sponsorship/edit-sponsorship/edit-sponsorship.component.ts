import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, timer } from 'rxjs';
import { Sponsorship } from 'src/app/models/sponsorship.model';
import { SponsorshipsService } from 'src/app/services/sponsorships.service';

@Component({
  selector: 'app-edit-sponsorship',
  templateUrl: './edit-sponsorship.component.html',
  styleUrls: ['./edit-sponsorship.component.scss']
})
export class EditSponsorshipComponent implements OnInit {

  editSponsorshipForm!:FormGroup;
  sponsorship_id:string;


  constructor(
    private _fb:FormBuilder,
    private _activatedRoute:ActivatedRoute,
    private _sponsorshipService:SponsorshipsService,
    private _router:Router,
    private _translateService: TranslateService,
    private _location:Location) { 
      this.sponsorship_id = this._activatedRoute.snapshot.params['id'];
      this.editSponsorshipForm = this.createForm();
      
    }

  ngOnInit(): void {
    console.log("Este el id que coge el activated route: ",this.sponsorship_id)
    this.createForm();
    this.setValues();
  }

  createForm(){
    return this._fb.group({
      sponsor_Id: [""],
      tripTicker: [""],
      banner:[""],
      page: [""],
      isPayed: [false]
    });
  }

  updateSponsorship(sponsorhip:Sponsorship){
    const sponsorshipPut$:Observable<Sponsorship> = this._sponsorshipService.updateSponsorship(sponsorhip);
    sponsorshipPut$.subscribe((sponsorship:Sponsorship) => {
      console.log(sponsorship)
    })
  }
  
  onSubmit(){
    const sponsorship: any = {
      id: this.sponsorship_id,
      tripTicker: this.sponsorshipForm['tripTicker'].value,
      banner: this.sponsorshipForm['banner'].value,
      page: this.sponsorshipForm['page'].value,
      sponsor_Id: this.sponsorshipForm['sponsor_Id'].value,
      isPayed: this.sponsorshipForm['isPayed'].value,
      
    }

    if(this.editSponsorshipForm.invalid){
      alert("No se pudo actualizar el sponsorship");
      return; //Si es form invÁlido, no actúes
    }

    this.updateSponsorship(sponsorship);
    setTimeout(() => {
      alert(this._translateService.instant('sponsorships.operation_edit_successfull'));
      this._location.back();
    }, 500); // Aquí estableces el tiempo en milisegundos (500ms = 
  
  }

  
  get sponsorshipForm(){
    return this.editSponsorshipForm.controls;
  }

  private setValues(){
    this._sponsorshipService.getSponsorshipById(this.sponsorship_id).subscribe(res => {
      console.log("Este es el sponsorship que queremos setear los valores:",res.sponsorship)
      
          this.sponsorshipForm['tripTicker'].setValue(res.sponsorship.tripTicker)
          this.sponsorshipForm['page'].setValue(res.sponsorship.page)
          this.sponsorshipForm['banner'].setValue(res.sponsorship.banner)
          this.sponsorshipForm['sponsor_Id'].setValue(res.sponsorship.sponsor_Id)
          this.sponsorshipForm['isPayed'].setValue(res.sponsorship.isPayed)
   
        })
      }

}
