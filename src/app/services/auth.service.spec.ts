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

  
  let newActor: Actor = new Actor;
  newActor.name = "Prueba explorer 3",
    newActor.surname = "Prueba",
    newActor.email = randomEmailGenerator(12),
    newActor.password = "explorer",
    newActor.phone = "123456789",
    newActor.address = "Calle prueba",
    newActor.role = ["EXPLORER"],
    newActor.validated = true

  let registeredActor: Actor = new Actor;
  registeredActor.name = "Prueba explorer 3",
    registeredActor.surname = "Prueba",
    // Use already registered email
    registeredActor.email = "tujwibwnedt3@gmail.com",
    registeredActor.password = "explorer",
    registeredActor.phone = "123456789",
    registeredActor.address = "Calle prueba",
    registeredActor.role = ["EXPLORER"],
    registeredActor.validated = true



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase)],
      providers: [AuthService, HttpClient, AngularFirestore, AngularFireAuth]
    });

    service = TestBed.get(AuthService);
    const authService = TestBed.inject(AngularFireAuth);
    const angularFirestore = TestBed.inject(AngularFirestore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register an user', async () => {
    let created = await service.registerUser(newActor);
    console.log("Created ->", created)

    expect(created).toBeDefined();
    expect(created).toEqual(jasmine.objectContaining({_email:newActor.email, _password:newActor.password}));
  });

  it('should login an user', async () => {
    let response = await service.login(registeredActor.email, registeredActor.password);
    console.log("Response ->", response)

    expect(response).toBeDefined();
    expect(response).toEqual(jasmine.objectContaining({email:registeredActor.email,}));
  });

  it('should give an error because the email is alreay in use', async () => {

    let created = await service.registerUser(registeredActor)
      .catch(err => console.error("Error tocho" , err));

    expect(created).toBeTruthy();
  });
});


function randomEmailGenerator(length: number): string {
  var randomChars = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';
  var result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }

  result += "@gmail.com";

  return result;
}

