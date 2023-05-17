import { TestBed } from '@angular/core/testing';

import { ApplicationsService } from './applications.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Application } from '../models/application.model';
import { Trip } from '../models/trip.model';
import { environment } from 'src/environments/environment';

/*describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let hhtpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicationsService]
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});*/

describe('ApplicationsService from trip id with multiple applications', () => {
  let service: ApplicationsService;
  let trip_id = '6434467d297d879c26d2336d';
  let httpTestingController: HttpTestingController;
  let testTripApplications: Application[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicationsService]
    });

    service = TestBed.inject(ApplicationsService);
    httpTestingController = TestBed.inject(HttpTestingController);

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getApplicationsByTripId should return a correct application array', async() => {
    let remoteApplications: Application[] = [];
    let response = service.getApplicationsByTripId(trip_id).then((response) => {
      console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId then response ", response);
      let casted_application = Application.castJsonApplications(response);
      remoteApplications = casted_application;
    });

    const request = httpTestingController.expectOne(environment.backendApiBaseURL + '/trips/' + trip_id + '/applications?trip=' + trip_id);
    request.flush(testTripApplications);

    await response;

    console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId remoteApplications ", remoteApplications);
    expect(remoteApplications.length).toBe(testTripApplications.length);
  });

  afterEach(() => {
    httpTestingController.verify();
  })
});

describe('ApplicationsService from trip id without applications', () => {
  let service: ApplicationsService;
  let trip_id = '6434467d297d879c26d2336d';
  let httpTestingController: HttpTestingController;
  let testTripApplications: Application[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicationsService]
    });

    service = TestBed.inject(ApplicationsService);
    httpTestingController = TestBed.inject(HttpTestingController);

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

    testTripApplications = Application.castJsonApplications([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getApplicationsByTripId should return an empty application array', async() => {
    let remoteApplications: Application[] = [];
    let response = service.getApplicationsByTripId(trip_id).then((response) => {
      console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId then response ", response);
      let casted_application = Application.castJsonApplications(response);
      remoteApplications = casted_application;
    });

    const request = httpTestingController.expectOne(environment.backendApiBaseURL + '/trips/' + trip_id + '/applications?trip=' + trip_id);
    request.flush(testTripApplications);

    await response;

    console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId remoteApplications ", remoteApplications);
    expect(remoteApplications.length).toBe(0);
  });

  afterEach(() => {
    httpTestingController.verify();
  })
});
