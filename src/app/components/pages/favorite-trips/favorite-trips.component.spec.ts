import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteTripsComponent } from './favorite-trips.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AngularFireModule } from '@angular/fire/compat';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { Actor } from 'src/app/models/actor.model';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

describe('FavoriteTripsComponent', () => {
  let component: FavoriteTripsComponent;
  let fixture: ComponentFixture<FavoriteTripsComponent>;

  const mockExplorerActor = Actor.castJsonActor({
    "_id": "64304c9dae7efef4708d821q",
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ FavoriteTripsComponent ]
    })
    .compileComponents();

    let authService = TestBed.inject(AuthService);
    spyOn(authService, 'getCurrentActor').and.returnValue(mockExplorerActor);

    fixture = TestBed.createComponent(FavoriteTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
