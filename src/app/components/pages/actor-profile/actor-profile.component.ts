import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { ActorsService } from 'src/app/services/actors.service';

@Component({
  selector: 'app-actor-profile',
  templateUrl: './actor-profile.component.html',
  styleUrls: ['./actor-profile.component.scss']
})
export class ActorProfileComponent implements OnInit {

  actor!:any;
  actor_id: string;


  constructor(private _actorsService:ActorsService,private route: ActivatedRoute, private router:Router) { 
    this.actor_id = this.route.snapshot.params['id'];
    // this.actorProfileForm =  this.fb.group({
    //   name: ['',Validators.required],
    //   surname: ['', Validators.required],
    //   password: ['',  [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{9}$")]],
    //   address : ['',Validators.required]
    // })
  }

  ngOnInit(): void {
    this.getActor();
  }



  getActor(){
    this._actorsService.getActorById(this.actor_id).subscribe((res)=>{
      console.log(res);
      return this.actor = res;
    })
  }

  goEdit(){
    this.router.navigateByUrl(`/actor/${this.actor_id}/profile-edit`)
  }

}
