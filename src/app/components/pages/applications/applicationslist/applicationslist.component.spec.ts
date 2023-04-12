import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationslistComponent } from './applicationslist.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Application } from 'src/app/models/application.model';
import { Actor } from 'src/app/models/actor.model';
import { AuthService } from 'src/app/services/auth.service';
import { Trip } from 'src/app/models/trip.model';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService } from 'src/app/services/applications.service';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);

}


describe('ApplicationslistComponent from trip id with multiple applications', () => {
  let component: ApplicationslistComponent;
  let fixture: ComponentFixture<ApplicationslistComponent>;
  let testTripApplications: Application[];
  let getApplicationsByTripIdSpy: any;
  let trip_id = '6434467d297d879c26d2336d';

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
      "MANAGER"
    ],
    "deleted": false,
    "__v": 0,
  });

  const mockTrip = Trip.castJsonTrip({
    "requirements": [],
    "_id": trip_id,
    "ticker": "7O{Q@v6)1)*",
    "title": "A trip to Jaredborough",
    "description": "Sed sequi accusantium sed consequuntur voluptas accusantium eaque expedita. Enim laboriosam voluptatum. Dolores veniam quia dolorum quaerat assumenda. Autem eius repellat consectetur perferendis vitae veniam.",
    "price": 105,
    "publicationDate": "2020-08-20T07:54:29.407Z",
    "startDate": "2020-10-31T05:57:14.713Z",
    "endDate": "2022-02-21T01:59:37.858Z",
    "managerId": "6434467d297d879c26d23348",
    "stages": [
      {
        "title": "Zone 1 of city Jaredborough",
        "description": "Delectus nihil eligendi et quas consequuntur. Quia aut sunt. Culpa voluptatum quas magni veniam adipisci perspiciatis qui minima.",
        "price": 47
      },
      {
        "title": "Zone 2 of city Jaredborough",
        "description": "In praesentium veniam. Odio facilis nesciunt veniam quaerat non tempora delectus ducimus. Sequi officiis et quia eligendi enim non illo qui et. Commodi magni unde exercitationem dolores a non commodi adipisci et.",
        "price": 27
      },
      {
        "title": "Zone 3 of city Jaredborough",
        "description": "Rerum aut et excepturi sit temporibus est. Unde et minima. Eos libero similique fugit quia. Et ullam vero commodi eos vero ut sed minus.",
        "price": 31
      }
    ],
    "canceled": false,
    "cancelReason": "",
    "pictures": []
  });


  beforeEach(async () => {
    testTripApplications = Application.castJsonApplications([{
      "applicationMoment": "2023-04-09T04:22:38.500Z",
      "comments": "Quam eius voluptas",
      "status": "PENDING",
      "explorer_Id": "64304c9dae7efef4708a796f",
      "trip_Id": trip_id,
      "rejected_reason": null
    },
    {
      "applicationMoment": "2023-04-09T04:22:38.500Z",
      "comments": "Quam eius voluptas",
      "status": "PENDING",
      "explorer_Id": "64304c9dae7efef4708a879c",
      "trip_Id": trip_id,
      "rejected_reason": null
    }]);

    let applicationSpy = jasmine.createSpyObj('ApplicationsService', ['getApplicationsByTripId']);
    getApplicationsByTripIdSpy = applicationSpy.getApplicationsByTripId.and.returnValue(Promise.resolve(testTripApplications));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ApplicationslistComponent],
      providers: [FormBuilder,
        {
          provide: ApplicationsService,
          useValue: applicationSpy
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => trip_id,
              },
            },
          }
        }]
    })
      .compileComponents();

    let authService = TestBed.inject(AuthService);
    spyOn(authService, 'getCurrentActor').and.returnValue(mockManagerActor);

    fixture = TestBed.createComponent(ApplicationslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct trip id', () => {
    fixture.detectChanges();
    expect(component.trip_id).toBe(trip_id);
  });

  it('component applications array length should equal the test applications array length', () => {
    fixture.detectChanges();
    expect(getApplicationsByTripIdSpy).toHaveBeenCalledWith(trip_id);
    expect(component.applications.length).toBe(testTripApplications.length);
  });
});

describe('ApplicationslistComponent from trip id without applications', () => {
  let component: ApplicationslistComponent;
  let fixture: ComponentFixture<ApplicationslistComponent>;
  let testTripApplications: Application[];
  let getApplicationsByTripIdSpy: any;
  let trip_id = '6434467d297d879c26d2336d';

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
      "MANAGER"
    ],
    "deleted": false,
    "__v": 0,
  });

  const mockTrip = Trip.castJsonTrip({
    "requirements": [],
    "_id": trip_id,
    "ticker": "7O{Q@v6)1)*",
    "title": "A trip to Jaredborough",
    "description": "Sed sequi accusantium sed consequuntur voluptas accusantium eaque expedita. Enim laboriosam voluptatum. Dolores veniam quia dolorum quaerat assumenda. Autem eius repellat consectetur perferendis vitae veniam.",
    "price": 105,
    "publicationDate": "2020-08-20T07:54:29.407Z",
    "startDate": "2020-10-31T05:57:14.713Z",
    "endDate": "2022-02-21T01:59:37.858Z",
    "managerId": "6434467d297d879c26d23348",
    "stages": [
      {
        "title": "Zone 1 of city Jaredborough",
        "description": "Delectus nihil eligendi et quas consequuntur. Quia aut sunt. Culpa voluptatum quas magni veniam adipisci perspiciatis qui minima.",
        "price": 47
      },
      {
        "title": "Zone 2 of city Jaredborough",
        "description": "In praesentium veniam. Odio facilis nesciunt veniam quaerat non tempora delectus ducimus. Sequi officiis et quia eligendi enim non illo qui et. Commodi magni unde exercitationem dolores a non commodi adipisci et.",
        "price": 27
      },
      {
        "title": "Zone 3 of city Jaredborough",
        "description": "Rerum aut et excepturi sit temporibus est. Unde et minima. Eos libero similique fugit quia. Et ullam vero commodi eos vero ut sed minus.",
        "price": 31
      }
    ],
    "canceled": false,
    "cancelReason": "",
    "pictures": []
  });


  beforeEach(async () => {
    testTripApplications = Application.castJsonApplications([]);

    let applicationSpy = jasmine.createSpyObj('ApplicationsService', ['getApplicationsByTripId']);
    getApplicationsByTripIdSpy = applicationSpy.getApplicationsByTripId.and.returnValue(Promise.resolve(testTripApplications));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ApplicationslistComponent],
      providers: [FormBuilder,
        {
          provide: ApplicationsService,
          useValue: applicationSpy
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => trip_id,
              },
            },
          }
        }]
    })
      .compileComponents();

    let authService = TestBed.inject(AuthService);
    spyOn(authService, 'getCurrentActor').and.returnValue(mockManagerActor);

    fixture = TestBed.createComponent(ApplicationslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct trip id', () => {
    fixture.detectChanges();
    expect(component.trip_id).toBe(trip_id);
  });

  it('component applications array length should be empty', () => {
    fixture.detectChanges();
    expect(getApplicationsByTripIdSpy).toHaveBeenCalledWith(trip_id);
    expect(component.applications.length).toBe(0);
  });
});
