import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySponsorshipComponent } from './pay-sponsorship.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActivatedRoute } from '@angular/router';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
describe('PaySponsorshipComponent', () => {
  let component: PaySponsorshipComponent;
  let fixture: ComponentFixture<PaySponsorshipComponent>;

  const sponsorship_id ="645980293ec8622274735922";
  const sponsorshipPrice = 20;

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
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                get: () => sponsorship_id,
              },
              queryParams: {
                get: () => sponsorshipPrice,
              }
            },
          }
        }],
      declarations: [ PaySponsorshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaySponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
