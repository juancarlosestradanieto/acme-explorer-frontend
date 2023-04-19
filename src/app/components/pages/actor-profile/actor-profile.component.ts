import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { ActorsService } from 'src/app/services/actors.service';

@Component({
  selector: 'app-actor-profile',
  templateUrl: './actor-profile.component.html',
  styleUrls: ['./actor-profile.component.scss']
})
export class ActorProfileComponent implements OnInit {

  actor!:Actor;
  actor_id: string;
  constructor(private _actorsService:ActorsService,private route: ActivatedRoute) { 
    this.actor_id = this.route.snapshot.params['id'];
    
  }
  ngOnInit(): void {
    this.getActor();
  }

  getActor(){
    this._actorsService.getActorById(this.actor_id).subscribe((res)=>{
      this.actor = res;
      console.log(res);
    })
  }

}
