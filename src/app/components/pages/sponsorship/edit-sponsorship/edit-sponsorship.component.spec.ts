import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSponsorshipComponent } from './edit-sponsorship.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}


let id = "64427605263cbf8e1a87295d";
describe('EditSponsorshipComponent', () => {
  let component: EditSponsorshipComponent;
  let fixture: ComponentFixture<EditSponsorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[FormsModule,HttpClientModule,ReactiveFormsModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
      declarations: [ EditSponsorshipComponent ],
      providers:[{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {params: {id: id}}
        }
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
