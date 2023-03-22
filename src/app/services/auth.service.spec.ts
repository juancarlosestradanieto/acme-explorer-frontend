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

    let actor: Actor = new Actor;
    actor.name = "Prueba explorer 3",
      actor.surname = "Prueba",
      actor.email = randomEmailGenerator(12),
      actor.password = "explorer",
      actor.phone = "123456789",
      actor.address = "Calle prueba",
      actor.role = ["EXPLORER"],
      actor.validated = true

    const prevActors = await service.getUsers();

    console.log("Prev Actors -> ", prevActors.length);

    let created = await service.registerUser(actor);
    console.log("Created ->", created)

    const postActors = await service.getUsers();

    console.log("Post Actors -> ", postActors.length);

    expect(postActors.length).toBe(prevActors.length + 1);
  });

  it('should give an error because the email is alreay in use', async () => {
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

    let actor: Actor = new Actor;
    actor.name = "Prueba explorer 3",
      actor.surname = "Prueba",
      actor.email = "fdhseh@explorer78.com",
      actor.password = "explorer",
      actor.phone = "123456789",
      actor.address = "Calle prueba",
      actor.role = ["EXPLORER"],
      actor.validated = true

    let created = await service.registerUser(actor)
      .catch(err => console.error(err));

    expect(created).toBeTruthy();
  });
});


/*function randomEmailGenerator(length: number): string {
  var randomChars = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';
  var result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }

  result += "@gmail.com";

  return result;
}*/

