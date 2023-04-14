import { TestBed } from '@angular/core/testing';

import { SponsorshipsService } from './sponsorships.service';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SponsorshipsService', () => {
  let service: SponsorshipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule],
      providers: [HttpClient, HttpHandler]});
    service = TestBed.inject(SponsorshipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
