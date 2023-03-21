import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
//import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Actor } from '../models/actor.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
      AngularFireModule.initializeApp(environment.firebase)], 
      providers: [AuthService,HttpClient,AngularFirestore,AngularFireAuth]
    });

    service = TestBed.get(AuthService);
    const authService =  TestBed.inject(AngularFireAuth);
    const angularFirestore = TestBed.inject(AngularFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register an user', () => {
    /*
   let actor:Actor = {
    name: "Prueba explorer",
    surname: "Prueba",
    email: "prueba@explorer.com",
    password: "explorer",
    phone: "123456789",
    address: "Calle prueba",
    role: ["EXPLORER"],
    validated: true
    }
    */

    let actor:Actor = new Actor;
    actor.name = "Prueba explorer",
    actor.surname = "Prueba",
    actor.email = "2103@explorer.com",
    actor.password = "explorer",
    actor.phone = "123456789",
    actor.address = "Calle prueba",
    actor.role = ["EXPLORER"],
    actor.validated = true
    
    let created = service.registerUser(actor);
    expect(created).toBeTruthy();
  });
});
