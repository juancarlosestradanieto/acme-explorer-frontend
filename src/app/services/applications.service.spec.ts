import { TestBed } from '@angular/core/testing';

import { ApplicationsService } from './applications.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    providers: [HttpClient]});
    service = TestBed.inject(ApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
