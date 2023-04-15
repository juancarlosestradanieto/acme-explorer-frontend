import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Actor } from 'src/app/models/actor.model';
import { Trip } from 'src/app/models/trip.model';
import { ActorsService } from 'src/app/services/actors.service';
import { ConfirmationService } from 'primeng/api';



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

  constructor(private _actorsService:ActorsService, private  _confirmationService:ConfirmationService){ }

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


  deleteActor(actorID:string){
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete this actor?',
      accept: () => {
        this._actorsService.deleteActor(actorID).subscribe(res =>{
          this.getAllActors(); //Para rellenar la tabla con los datos cada vez que borremos alguno
        },(err =>{
        }))
          
      },
      reject: () => {
        return
      }
  });
  }
  

}
