import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { SingleTripComponent } from './single-trip.component';
import { ActivatedRoute } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { TripsService } from 'src/app/services/trips/trips.service';



describe('SingleTripComponent', () => {
  let component: SingleTripComponent;
  let fixture: ComponentFixture<SingleTripComponent>;

  let trip_id = '6434467d297d879c26d2336d';

  let fake_trip =     {
    "requirements": [],
    "_id": "6434467d297d879c26d2336d",
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
  };

  let tripSpy: any;
  let getSingleTripSpy: any;

  beforeEach(async () => {

    tripSpy = jasmine.createSpyObj("TripsService", ["getSingleTrip"]);
    //getSingleTripSpy = tripSpy.getSingleTrip.and.returnValue(of (fake_trip));
    getSingleTripSpy = tripSpy.getSingleTrip.and.returnValue(Promise.resolve([fake_trip]));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase)],
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
});
