import { TestBed } from '@angular/core/testing';

import { SponsorshipsService } from './sponsorships.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SponsorshipsService', () => {
  let service: SponsorshipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]});
    service = TestBed.inject(SponsorshipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
