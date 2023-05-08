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
import { Trip } from 'src/app/models/trip.model';
import { Application } from 'src/app/models/application.model';
import { ActivatedRoute } from '@angular/router';
import { TripsService } from 'src/app/services/trips/trips.service';
import { ApplicationsService } from 'src/app/services/applications.service';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

let explorer_id = '64304c9dae7efef4708a796f';

const mockActor = Actor.castJsonActor({
  "_id": explorer_id,
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


let trip_id = '6434467d297d879c26d2336d';

let mockTrip = Trip.castJsonTrip({
  "canceled": false,
  "cancelReason": "",
  "description": "Sed sequi accusantium sed consequuntur voluptas accusantium eaque expedita.",
  "endDate": "2030-11-02",
  "id": "6434467d297d879c26d2336d",
  "managerId": "6434467d297d879c26d23348",
  "pictures": [],
  "price": 105,
  "publicationDate": "2020-08-20",
  "requirements": [],
  "stages": [],
  "startDate": "2030-10-31",
  "ticker": "7O{Q@v6)1)*",
  "title": "A trip to CHIPIONA",
  "_id": "6434467d297d879c26d2336d",
});

let mockStartedTrip = Trip.castJsonTrip({
  "canceled": false,
  "cancelReason": "",
  "description": "Sed sequi accusantium sed consequuntur voluptas accusantium eaque expedita.",
  "endDate": "2010-11-02",
  "id": "6434467d297d879c26d2336d",
  "managerId": "6434467d297d879c26d23348",
  "pictures": [],
  "price": 105,
  "publicationDate": "2020-08-20",
  "requirements": [],
  "stages": [],
  "startDate": "2010-10-31",
  "ticker": "7O{Q@v6)1)*",
  "title": "A trip to CHIPIONA",
  "_id": "6434467d297d879c26d2336d",
});

let tripApplication = new Application({
  "applicationMoment": "2023-04-09T04:22:38.500Z",
  "comments": "Quam eius voluptas",
  "status": "PENDING",
  "explorer_Id": explorer_id,
  "trip_Id": trip_id,
  "rejected_reason": null
});

describe('ApplicationcreationComponent', () => {
  let component: ApplicationcreationComponent;
  let fixture: ComponentFixture<ApplicationcreationComponent>;

  let createApplicationsSpy: any;
  let getApplicationsByExplorerIdSpy: any;
  let getSingleTripSpy: any;

  let tripSpy = jasmine.createSpyObj('TripService', ['getSingleTrip']);
  let applicationSpy = jasmine.createSpyObj('ApplicationsService', ['createApplication', 'getApplicationsByExplorerId']);

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
      ], providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: trip_id } }
          }
        },
        {
          provide: TripsService,
          useValue: tripSpy
        },
        {
          provide: ApplicationsService,
          useValue: applicationSpy
        }
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

  afterEach(() => {
    getSingleTripSpy.calls.reset();
    createApplicationsSpy.calls.reset();
    getApplicationsByExplorerIdSpy.calls.reset();
  })

  it('should apply for not started trip', async () => {
    getSingleTripSpy = tripSpy.getSingleTrip.and.returnValue(Promise.resolve(mockTrip));
    createApplicationsSpy = applicationSpy.createApplication.and.returnValue(Promise.resolve(tripApplication));
    getApplicationsByExplorerIdSpy = applicationSpy.getApplicationsByExplorerId.and.returnValue(Promise.resolve([]));

    await component.getTrip();

    await component.onApplicationSubmit();

    expect(component).toBeTruthy();
    expect(getSingleTripSpy).toHaveBeenCalledWith(trip_id);
    expect(createApplicationsSpy).toHaveBeenCalledWith(component.applicationForm.value);
    expect(getApplicationsByExplorerIdSpy).toHaveBeenCalledWith(explorer_id);
    expect(component.trip_started).toBeFalsy();
    expect(component.application_exists).toBeFalsy();
  });

  it('should not apply for already started trip', async () => {
    getSingleTripSpy = tripSpy.getSingleTrip.and.returnValue(Promise.resolve(mockStartedTrip));
    createApplicationsSpy = applicationSpy.createApplication.and.returnValue(Promise.resolve(tripApplication));
    getApplicationsByExplorerIdSpy = applicationSpy.getApplicationsByExplorerId.and.returnValue(Promise.resolve([]));

    await component.getTrip();

    await component.onApplicationSubmit();

    expect(component).toBeTruthy();
    expect(getSingleTripSpy).toHaveBeenCalledWith(trip_id);
    expect(createApplicationsSpy).not.toHaveBeenCalledWith(component.applicationForm.value);
    expect(getApplicationsByExplorerIdSpy).not.toHaveBeenCalledWith(explorer_id);
    expect(component.trip_started).toBeTruthy();
    expect(component.application_created).toBeFalsy();
    expect(component.application_exists).toBeFalsy();
  });
});
