import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { Actor } from 'src/app/models/actor.model';
import { ActorsService } from 'src/app/services/actors.service';

@Component({
  selector: 'app-actor-profile-edit',
  templateUrl: './actor-profile-edit.component.html',
  styleUrls: ['./actor-profile-edit.component.scss']
})
export class ActorProfileEditComponent implements OnInit {

  editProfileForm!:FormGroup;
  error_message!: string;
  success_message!: string;
  actor_id!:string

  constructor(private fb:FormBuilder, 
    private _actorsService:ActorsService, 
     private _location:Location ,
     private _activatedRoute:ActivatedRoute) { 
    this.actor_id = this._activatedRoute.snapshot.params['id'];
    this.editProfileForm = this.createForm();
  }
  
  ngOnInit(): void {
    this.createForm();
    this.setValues();
  }

  createForm() {
    return this.fb.group({
      name: ['',Validators.required],
      surname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(10)]],
      phone_number: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{9}$")]],
      address: ['',Validators.required],
    });
  }

  updateActor(actor:Actor){
    const actorPut$:Observable<Actor> = this._actorsService.updateActor(actor);
    actorPut$.subscribe((actor:Actor) => {
      console.log(actor)
      timer(500).subscribe(done =>{
        this._location.back();
        this.success_message = "The actor"+actor.id+"modified successfully";
      })
  })
}

  onSubmit(){
    const actor: any = {
      id: this.actor_id,
      name: this.actorForm['name'].value,
      surname: this.actorForm['surname'].value,
      password: this.actorForm['password'].value,
      phone_number: this.actorForm['phone_number'].value,
      address: this.actorForm['address'].value,
    }

    if(this.editProfileForm.invalid){
      this.error_message ="The actor did not updated!";
      return; //Si es form invÁlido, no actúes
    }

    this.updateActor(actor);

  }

  get actorForm(){
    return this.editProfileForm.controls;
  }

  private setValues(){
        this._actorsService.getActorById(this.actor_id).subscribe(actor => {
          console.log(actor)
          // console.log(category)
          this.actorForm['name'].setValue(actor.name)
          this.actorForm['surname'].setValue(actor.surname)
          this.actorForm['password'].setValue(actor.password)
          this.actorForm['phone_number'].setValue(actor.phone_number)
          this.actorForm['address'].setValue(actor.address)
   
        })
      }
}
  
