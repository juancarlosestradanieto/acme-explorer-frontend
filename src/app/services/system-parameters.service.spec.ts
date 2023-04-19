import { TestBed } from '@angular/core/testing';

import { SystemParametersService } from './system-parameters.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SystemParametersService', () => {
  let service: SystemParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SystemParametersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
