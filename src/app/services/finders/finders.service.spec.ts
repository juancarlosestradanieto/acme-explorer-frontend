import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FindersService } from './finders.service';

describe('FindersService', () => {
  let service: FindersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(FindersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
