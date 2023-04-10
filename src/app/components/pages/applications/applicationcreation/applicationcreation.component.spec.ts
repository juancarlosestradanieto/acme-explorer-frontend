import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationcreationComponent } from './applicationcreation.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Actor } from 'src/app/models/actor.model';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

const mockActor = Actor.castJsonActor({
  "_id": "64304c9dae7efef4708a796f",
  "phone": "test",
  "name": "test",
  "surname": "test",
  "email": "test168086733ergehreh6269@gmail.com",
  "password": "$2b$05$4jsKd5Z0wHz68ybBUL5Ec.XHvFPtJWoV9o6pKlqXAMCj9Rzt/T0fS",
  "language": [],
  "address": "test",
  "isActive": true,
  "role": [
    "EXPLORER"
  ],
  "deleted": false,
  "__v": 0,
});

describe('ApplicationcreationComponent', () => {
  let component: ApplicationcreationComponent;
  let fixture: ComponentFixture<ApplicationcreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ApplicationcreationComponent]
    })
      .compileComponents();

    let authService = TestBed.inject(AuthService);

    spyOn(authService, 'getCurrentActor').and.returnValue(mockActor);

    fixture = TestBed.createComponent(ApplicationcreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
