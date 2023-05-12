import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFavouriteListsComponent } from './update-favourite-lists.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Actor } from 'src/app/models/actor.model';

let explorer_id = '64304c9dae7efef4708a796f';

const mockActor = Actor.castJsonActor({
  "_id": explorer_id,
  "phone": "test",
  "name": "test",
  "surname": "test",
  "email": "test168086733ergehreh6269@gmail.com",
  "password": "$2b$05$4jsKd5Z0wHz68ybBUL5Ec.XHvFPtJWoV9o6pKlqXAMCj9Rzt/T0fS",
  "language": [],
  "address": "test",
  "isActive": true,
  "role": [
    "EXPLORER"
  ],
  "deleted": false,
  "__v": 0,
});

describe('UpdateFavouriteListsComponent', () => {
  let component: UpdateFavouriteListsComponent;
  let fixture: ComponentFixture<UpdateFavouriteListsComponent>;

  let trip_id = '6434467d297d879c26d2336d';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ UpdateFavouriteListsComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: {id: trip_id}}
          }
        }
      ]
    })
    .compileComponents();

    let authService = TestBed.inject(AuthService);
    spyOn(authService, 'getCurrentActor').and.returnValue(mockActor);

    fixture = TestBed.createComponent(UpdateFavouriteListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
