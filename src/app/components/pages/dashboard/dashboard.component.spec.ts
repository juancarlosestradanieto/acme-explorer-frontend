import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthService } from 'src/app/services/auth.service';
import { Actor } from 'src/app/models/actor.model';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { DashboardService } from 'src/app/services/dashboard.service';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let getDashboardSpy: any;

  const mockManagerActor = Actor.castJsonActor({
    "_id": "64304c9dae7efef4708d821q",
    "phone": "test",
    "name": "test",
    "surname": "test",
    "email": "test168086733ergehreh6269@gmail.com",
    "password": "$2b$05$4jsKd5Z0wHz68ybBUL5Ec.XHvFPtJWoV9o6pKlqXAMCj9Rzt/T0fS",
    "language": [],
    "address": "test",
    "isActive": true,
    "role": [
      "ADMINISTRATOR"
    ],
    "deleted": false,
    "__v": 0,
  });

  beforeEach(async () => {
    const mockDashboard = {
      "error": false,
      "message": " Latest dashboard successfully retrieved.",
      "dashboard": [
        {
          "tripsPerManager": {
            "_id": "64391e2cddf126e7eec41a5d",
            "average": 100,
            "minimum": 100,
            "maximum": 100,
            "standardDeviation": 0
          },
          "applicationsPerTrip": {
            "_id": "64391e2cddf126e7eec41a5f",
            "average": 1.7543859649122806,
            "minimum": 1,
            "maximum": 4,
            "standardDeviation": 0.9783749820069252
          },
          "priceOfTrips": {
            "_id": "64391e2cddf126e7eec41a5e",
            "average": 91.33,
            "minimum": 49,
            "maximum": 146,
            "standardDeviation": 21.21700025922609
          },
          "_id": "64391e2cddf126e7eec41a5e",
          "applicationsRatioPerStatus": [
            {
              "status": "CANCELLED",
              "ratio": 0.19,
              "_id": "64391e2cddf126e7eec41a58"
            },
            {
              "status": "DUE",
              "ratio": 0.14,
              "_id": "64391e2cddf126e7eec41a59"
            },
            {
              "status": "REJECTED",
              "ratio": 0.17,
              "_id": "64391e2cddf126e7eec41a5a"
            },
            {
              "status": "ACCEPTED",
              "ratio": 0.29,
              "_id": "64391e2cddf126e7eec41a5b"
            },
            {
              "status": "PENDING",
              "ratio": 0.21,
              "_id": "64391e2cddf126e7eec41a5c"
            }
          ],
          "computationMoment": "2023-04-14T09:34:36.003Z",
          "rebuildPeriod": "*/2 * * * * *",
          "__v": 0
        }
      ]

    };

    let dashboardSpy = jasmine.createSpyObj('DashboardService', ['getDashboard']);
    getDashboardSpy = dashboardSpy.getDashboard.and.returnValue(Promise.resolve(mockDashboard));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [{
        provide: DashboardService,
        useValue: dashboardSpy
      }],
      declarations: [DashboardComponent]
    })
      .compileComponents();

    let authService = TestBed.inject(AuthService);
    spyOn(authService, 'getCurrentActor').and.returnValue(mockManagerActor);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
