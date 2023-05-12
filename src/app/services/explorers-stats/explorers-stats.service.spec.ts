import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ExplorersStatsService } from './explorers-stats.service';

describe('ExplorerStatsService', () => {
  let service: ExplorersStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(ExplorersStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
