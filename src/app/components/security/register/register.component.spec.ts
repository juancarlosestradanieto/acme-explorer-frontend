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
    const registerForm = component.registrationForm;
    const registrationFormValues = {
      name: 'test',
      surname: 'test',
      email: 'test@test.test',
      password: '123456',
      phone: 'test',
      address: 'test',
      role: 'EXPLORER',
      validated: true
    }

    expect(registerForm.value).toEqual(registrationFormValues);
  });

  it('should send register form', inject([Router], fakeAsync((mockRouter: Router) => {
    let authService = TestBed.inject(AuthService);
    let serviceSpy = spyOn(authService, 'registerUser').and.returnValue(Promise.resolve({}));
    let navigatorSpy = spyOn(mockRouter, 'navigate').and.stub();

    component.onRegister();

    tick();

    expect(component.error_message).toEqual("");
    expect(component.success_message).toEqual("User registered and logged in successfully");
    expect(serviceSpy).toHaveBeenCalled();
    expect(navigatorSpy.calls.first().args[0]).toContain('/trips/list');
  })));
});
