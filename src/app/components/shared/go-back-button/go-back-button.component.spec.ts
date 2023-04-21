import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoBackButtonComponent } from './go-back-button.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

describe('GoBackButtonComponent', () => {
  let component: GoBackButtonComponent;
  let fixture: ComponentFixture<GoBackButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoBackButtonComponent ],
      imports:[HttpClientModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
