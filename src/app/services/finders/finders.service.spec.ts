import { TestBed } from '@angular/core/testing';

import { FindersService } from './finders.service';

describe('FindersService', () => {
  let service: FindersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
