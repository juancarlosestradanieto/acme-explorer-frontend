import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayapplicationComponent } from './payapplication.component';
import { ActivatedRoute } from '@angular/router';
import { Application } from 'src/app/models/application.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}


describe('PayapplicationComponent', () => {
  let component: PayapplicationComponent;
  let fixture: ComponentFixture<PayapplicationComponent>;

  let application_id = '6434467d297d879c26d2336d';
  let tripPrice = 40;

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ PayapplicationComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                get: () => application_id,
              },
              queryParams: {
                get: () => tripPrice,
              }
            },
          }
        }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
