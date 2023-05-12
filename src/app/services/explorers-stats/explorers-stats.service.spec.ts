import { TestBed } from '@angular/core/testing';

import { ExplorersStatsService } from './explorers-stats.service';

describe('ExplorerStatsService', () => {
  let service: ExplorersStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExplorersStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
