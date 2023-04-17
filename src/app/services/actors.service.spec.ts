import { TestBed } from '@angular/core/testing';

import { ActorsService } from './actors.service';
import { HttpClientModule } from '@angular/common/http';

describe('ActorsService', () => {
  let service: ActorsService;
  // let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule],
      providers:[ActorsService]
    });
    service = TestBed.inject(ActorsService);
    // httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
