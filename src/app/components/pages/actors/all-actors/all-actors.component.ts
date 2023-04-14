import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Actor } from 'src/app/models/actor.model';
import { Trip } from 'src/app/models/trip.model';
import { ActorsService } from 'src/app/services/actors.service';

@Component({
  selector: 'app-all-actors',
  templateUrl: './all-actors.component.html',
  styleUrls: ['./all-actors.component.scss']
})
export class AllActorsComponent implements OnInit {

  actors!:Actor[];

 
  //paginación
  actorsLength!:number;
  pageSize:number = 10
  desde:number = 0;
  hasta:number = 10;
  
  constructor(private _actorsService:ActorsService) { }

  ngOnInit(): void {
    this.getAllActors();
  }

  getAllActors(){
    this._actorsService.getActors().subscribe((res)=>{
      console.log("Todos los actores devueltos en la respuesta: ",res)
      this.actors=res;
      this.actorsLength = res.length;
    })
  }

  cambiarPagina(e:PageEvent){
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

   


}
