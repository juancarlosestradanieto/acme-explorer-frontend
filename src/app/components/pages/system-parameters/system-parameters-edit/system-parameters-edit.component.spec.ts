import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParametersEditComponent } from './system-parameters-edit.component';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);

}

describe('SystemParametersEditComponent', () => {
  let component: SystemParametersEditComponent;
  let fixture: ComponentFixture<SystemParametersEditComponent>;

  let pageModeTest = 'display';

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
      declarations: [ SystemParametersEditComponent ],
      providers: [FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
              paramMap: of ({
                pageMode: pageModeTest
            }),
          }
        }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemParametersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
