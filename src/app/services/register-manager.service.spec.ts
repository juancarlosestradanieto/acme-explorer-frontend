import { TestBed } from '@angular/core/testing';

import { RegisterManagerService } from './register-manager.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder } from '@angular/forms';

describe('RegisterManagerService', () => {
  let service: RegisterManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule,
      AngularFireModule.initializeApp(environment.firebase)],
      providers: [RegisterManagerService, AngularFirestore, AngularFireAuth, FormBuilder]      
    });
    service = TestBed.inject(RegisterManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
