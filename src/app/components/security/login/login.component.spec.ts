import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { AllTripsComponent } from '../../pages/trips/all-trips/all-trips.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, AngularFireModule.initializeApp(environment.firebase),
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
      providers: [HttpClient, HttpHandler, AngularFirestore, AngularFireAuth]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create login form', () => {
    const formElements = fixture.debugElement.nativeElement.querySelector('#loginForm');

    const inputElements = formElements.getElementsByTagName('input');
    console.log("input elements -> ", inputElements);
    expect(inputElements.length).toEqual(2);

    const buttons = formElements.getElementsByTagName('button');
    console.log("button elements -> ", buttons);
    expect(buttons.length).toEqual(1);
  });

  it('should send login form', inject([Router], fakeAsync((mockRouter: Router) => {
    const formElements = fixture.debugElement.nativeElement.querySelector('#loginForm');
    const emailInput = formElements.querySelector('#email');
    const passInput = formElements.querySelector('#password');

    fixture.detectChanges();

    emailInput.value = environment.TEST_EMAIL;
    passInput.value = environment.TEST_PASSWORD;

    emailInput.dispatchEvent(new Event('input'));
    passInput.dispatchEvent(new Event('input'));

    let authService = TestBed.inject(AuthService);
    let serviceSpy = spyOn(authService, 'login').and.returnValue(Promise.resolve({refreshToken:""}));
    let navigatorSpy = spyOn(mockRouter, 'navigate').and.stub();

    component.onLogin(component.f);

    tick();

    expect(component.error_message).toEqual("");
    expect(component.success_message).toEqual("The user has been authenticated in firebase");
    expect(serviceSpy).toHaveBeenCalled();
    //expect(navigatorSpy.calls.first().args[0]).toContain('/trips/list');
  })));
});
