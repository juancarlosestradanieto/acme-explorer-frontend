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


  let newActor: Actor = new Actor(null);
  newActor.setName("Prueba explorer 3");
  newActor.setSurname("Prueba");
  newActor.setEmail(randomEmailGenerator(12));
  newActor.setPassword("explorer");
  newActor.setPhone_number("123456789");
  newActor.setAddress("Calle prueba");
  newActor.setRole(["EXPLORER"]);
  newActor.setIsActive(true);

  let registeredActor: Actor = new Actor(null);
  registeredActor.setName("Prueba explorer 3");
  registeredActor.setSurname("Prueba");
  registeredActor.setEmail(environment.TEST_EMAIL);
  registeredActor.setPassword(environment.TEST_PASSWORD);
  registeredActor.setPhone_number("123456789");
  registeredActor.setAddress("Calle prueba");
  registeredActor.setRole(["EXPLORER"]);
  registeredActor.setIsActive(true);

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
    console.log("Registered user ->", created)

    expect(created).toBeDefined();
    expect(created).toEqual(jasmine.objectContaining({ _email: newActor.getEmail(), _password: newActor.getPassword() }));
  });

  it('should login an user', async () => {
    let response = await service.login(registeredActor.getEmail(), registeredActor.getPassword());
    console.log("Login Response ->", response)

    expect(response).toBeDefined();
    expect(response).toEqual(jasmine.objectContaining({ email: registeredActor.getEmail()}));
    expect(service.isLoggedIn()).toBeTruthy();
  });

  it('should logout an user', async () => {
    let response = await service.login(registeredActor.getEmail(), registeredActor.getPassword());
    console.log("Login Response ->", response)
    expect(service.isLoggedIn()).toEqual(true);

    await service.logout();
    expect(service.isLoggedIn()).toBeFalsy();
  });

})

function randomEmailGenerator(length: number): string {
  var randomChars = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';
  var result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }

  result += "@gmail.com";

  return result;
}

