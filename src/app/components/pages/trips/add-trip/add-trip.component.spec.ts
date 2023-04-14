import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTripComponent } from './add-trip.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { TripsService } from 'src/app/services/trips/trips.service';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

let mockJungleTripTripFormData = {
  managerId: "6435a0d99e47fd1155253783",
  title: "Jungle party",
  description: "Jungle party",
  price: 1000,
  requirements: [
    "Requirement 1",
    "Requirement 2"
  ],
  publicationDate: "2021-06-23",
  startDate: "2021-07-01",
  endDate: "2021-07-06",
  pictures: [],
  stages: [
    {
      title: "Title stage 1",
      description: "Description stage 1",
      price: 500
    },
    {
      title: "Title stage 2",
      description: "Description stage 2",
      price: 500
    }
  ],
};

let mockJungleTripServiceResponse = {
  _id: "6435e5969e47fd11552537ae",
  managerId: "6435a0d99e47fd1155253783",
  title: "Jungle party",
  description: "Jungle party",
  price: 1000,
  requirements: [
    "Requirement 1",
    "Requirement 2"
  ],
  publicationDate: new Date("2021-06-23"),
  startDate: new Date("2021-07-01"),
  endDate: new Date("2021-07-06"),
  pictures: [],
  stages: [
    {
      title: "Title stage 1",
      description: "Description stage 1",
      price: 500
    },
    {
      title: "Title stage 2",
      description: "Description stage 2",
      price: 500
    }
  ],
  canceled: false,
  ticker: "235611-NDXF",
  __v: 0,
  _version: 0
};

describe('AddTripComponent', () => {
  let component: AddTripComponent;
  let fixture: ComponentFixture<AddTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTripComponent ],
      imports: [
        FormsModule, 
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
      providers: [
        HttpClient, 
        HttpHandler, 
        AngularFirestore, 
        AngularFireAuth,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: {id: '1'}}
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should create a trip with description "Jungle Party"', fakeAsync(() => {

    let formatFormDataSpy = spyOn(component, 'formatFormData').and.returnValue(mockJungleTripTripFormData);

    let tripService = TestBed.inject(TripsService);
    let serviceSpy = spyOn(tripService, 'createTrip').and.returnValue(Promise.resolve(mockJungleTripServiceResponse));

    component.edit_mode = false;
    component.onSubmit();

    tick();

    expect(serviceSpy).toHaveBeenCalled();
    expect(formatFormDataSpy).toHaveBeenCalled();
    expect(component).toBeTruthy();
    expect(component.created_trip.getTitle()).toEqual("Jungle party");
    expect(component.created_trip.getPrice()).toEqual(1000);
    expect(component.created_trip.getPublicationDate()).toEqual(new Date("2021-06-23"));
    expect(component.created_trip.getStartDate()).toEqual(new Date("2021-07-01"));
    expect(component.created_trip.getEndDate()).toEqual(new Date("2021-07-06"));
  }));

  it('Should fail to create a trip with description "Jungle Party"', fakeAsync(() => {
    
    let formatFormDataSpy = spyOn(component, 'formatFormData').and.returnValue(mockJungleTripTripFormData);

    let mockResponse = 'The actor has not the required roles.';
    let tripService = TestBed.inject(TripsService);
    let serviceSpy = spyOn(tripService, 'createTrip').and.returnValue(Promise.reject(mockResponse));

    component.edit_mode = false;
    component.onSubmit();

    tick();

    expect(serviceSpy).toHaveBeenCalled();
    expect(formatFormDataSpy).toHaveBeenCalled();
    expect(component).toBeTruthy();
    expect(component.error_message).toEqual("Something went wrong");
  }));

});
