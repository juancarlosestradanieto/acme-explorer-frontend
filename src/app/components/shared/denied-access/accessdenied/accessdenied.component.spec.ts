import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessdeniedComponent } from './accessdenied.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

describe('AccessdeniedComponent', () => {
  let component: AccessdeniedComponent;
  let fixture: ComponentFixture<AccessdeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
          }
      })],
      providers: [],
      declarations: [ AccessdeniedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessdeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
