import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationdisplayComponent } from './applicationdisplay.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

describe('ApplicationdisplayComponent', () => {
  let component: ApplicationdisplayComponent;
  let fixture: ComponentFixture<ApplicationdisplayComponent>;

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
      declarations: [ ApplicationdisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
