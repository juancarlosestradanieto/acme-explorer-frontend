import { TestBed } from '@angular/core/testing';

import { PreCancelledTripsService } from './pre-cancelled-trips.service';

describe('PreCancelledTripsService', () => {
  let service: PreCancelledTripsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreCancelledTripsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
