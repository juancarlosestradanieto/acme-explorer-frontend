import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSponsorshipComponent } from './detail-sponsorship.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}


let id:string = "644db1c57be16ae473f692c5"
describe('DetailSponsorshipComponent', () => {
  let component: DetailSponsorshipComponent;
  let fixture: ComponentFixture<DetailSponsorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
      declarations: [ DetailSponsorshipComponent ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {params: {id: id}}
        }
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
