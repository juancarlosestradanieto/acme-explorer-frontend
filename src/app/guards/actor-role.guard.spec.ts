import { TestBed } from '@angular/core/testing';

import { ActorRoleGuard } from './actor-role.guard';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('ActorRoleGuard', () => {
  let guard: ActorRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
    });
    guard = TestBed.inject(ActorRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
