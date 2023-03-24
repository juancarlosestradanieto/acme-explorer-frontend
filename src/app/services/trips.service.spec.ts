import { TestBed } from '@angular/core/testing';
import { TripsService } from './trips.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('TripsService', () => {
  let service: TripsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(TripsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
