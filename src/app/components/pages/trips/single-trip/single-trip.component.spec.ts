import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { SingleTripComponent } from './single-trip.component';
import { ActivatedRoute } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { TripsService } from 'src/app/services/trips/trips.service';
import { Trip } from 'src/app/models/trip.model';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

describe('SingleTripComponent', () => {
  let component: SingleTripComponent;
  let fixture: ComponentFixture<SingleTripComponent>;

  let trip_id = '6434467d297d879c26d2336d';

  let fake_trip = Trip.castJsonTrip({
    "canceled": false,
    "cancelReason":"",
    "description": "Sed sequi accusantium sed consequuntur voluptas accusantium eaque expedita. Enim laboriosam voluptatum. Dolores veniam quia dolorum quaerat assumenda. Autem eius repellat consectetur perferendis vitae veniam.",
    "endDate": "2022-02-21",
    "id": "6434467d297d879c26d2336d",
    "managerId": "6434467d297d879c26d23348",
    "pictures": [],
    "price": 105,
    "publicationDate": "2020-08-20",
    "requirements": [],
    "stages": [],
    "startDate": "2020-10-31",
    "ticker": "7O{Q@v6)1)*",
    "title": "A trip to CHIPIONA",
    "_id": "6434467d297d879c26d2336d",
  })      

  let tripSpy: any;
  let getSingleTripSpy: any;

  beforeEach(async () => {

    tripSpy = jasmine.createSpyObj("TripsService", ["getSingleTrip"]);
    //getSingleTripSpy = tripSpy.getSingleTrip.and.returnValue(of (fake_trip));
    getSingleTripSpy = tripSpy.getSingleTrip.and.returnValue(Promise.resolve([fake_trip]));



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
      declarations: [ SingleTripComponent ],
      providers: [
        HttpClient, 
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: {id: trip_id}}
          }
        },
        {
          provide: TripsService,
          useValue: tripSpy
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct id', () => {
    expect(component.trip_id).toBe(trip_id);
  });

  it('should have called trip service', () => {
    expect(getSingleTripSpy).toHaveBeenCalled();
  });

  it('should have been called with', () => {
    expect(getSingleTripSpy).toHaveBeenCalledWith(trip_id);
  });

  /*
  it('should have correct price', () => {
    fixture.detectChanges();
    console.log("component.json_trip.price ", component.json_trip.price);

    getSingleTripSpy.then((json_trip: any) => {
      console.log("json_trip ", json_trip);
      expect(json_trip.price).toBe(fake_trip.price);
    });
  });
  */

  
 it('should be displayed', () => {
    component.trip = fake_trip;
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(SingleTripComponent);
    expect(getSingleTripSpy).toHaveBeenCalled();
    expect(component).toBeTruthy();
    expect(fake_trip.getTitle()).toEqual("A trip to CHIPIONA");
    expect(fake_trip.getPrice()).toEqual(105);
    expect(fake_trip.getManagerId()).toEqual("6434467d297d879c26d23348");
  });

  it('should set the trip property when getSingleTrip resolves successfully', async () => {
    const response = fake_trip;
    tripSpy.getSingleTrip.and.resolveTo(response);

    await component.getTrip();

    expect(component.trip).toEqual(response);
  });



});

