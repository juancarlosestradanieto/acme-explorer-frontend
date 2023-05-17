import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { AllTripsComponent } from '../../pages/trips/all-trips/all-trips.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule, AngularFireModule.initializeApp(environment.firebase), ReactiveFormsModule,
        RouterTestingModule.withRoutes(
          [{path: 'trips/list', component: AllTripsComponent}]
        ),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })],
      providers: [HttpClient, HttpHandler, AngularFirestore, AngularFireAuth, FormBuilder]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create register form', () => {
    const formElements = fixture.debugElement.nativeElement.querySelector('#registerForm');

    const select = formElements.getElementsByTagName('select');
    console.log("select elements -> ", select);
    expect(select.length).toEqual(1);

    const inputElements = formElements.getElementsByTagName('input');
    console.log("input elements -> ", inputElements);
    expect(inputElements.length).toEqual(6);

    const buttons = formElements.getElementsByTagName('button');
    console.log("button elements -> ", buttons);
    expect(buttons.length).toEqual(1);
  });

  it('should have mock initial values', () => {
    let now = new Date();
    const registerForm = component.registrationForm;

    registerForm.value.email = 'test'+(now.getTime())+'@gmail.com';

    const registrationFormValues = {
      name: 'test',
      surname: 'test',
      email: 'test'+(now.getTime())+'@gmail.com',
      password: '1234567890',
      phone_number: '123456789',
      address: 'test',
      role: ['EXPLORER'],
      isActive: true
    }

    expect(registerForm.value).toEqual(registrationFormValues);
  });

  it('should send register form',  fakeAsync(() => {
    let authService = TestBed.inject(AuthService);
    let mockResponse = {
      "phone_number": "test",
      "name": "test",
      "surname": "test",
      "email": "test1680948412118@gmail.com",
      "password": "$2b$05$p8EZ4t2iYSgyoIwlWTEXJOx./HwKTl5hWYCyctaGDAtk1RyISmsgW",
      "language": [],
      "address": "test",
      "isActive": true,
      "role": [
          "EXPLORER"
      ],
      "_id": "64313cc47b739af5720727c0",
      "deleted": false,
      "__v": 0
  };
    let serviceSpy = spyOn(authService, 'registerUser').and.returnValue(Promise.resolve(mockResponse));

    component.onRegister();

    tick();

    expect(component.error_message).toEqual("");
    expect(component.success_message).toEqual("User with email '"+mockResponse.email+"' registered successfully");
    expect(serviceSpy).toHaveBeenCalled();
  }));
});
