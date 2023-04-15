import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllActorsComponent } from './all-actors.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmationService } from 'primeng/api/confirmationservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}


describe('AllActorsComponent', () => {
  let component: AllActorsComponent;
  let fixture: ComponentFixture<AllActorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,ConfirmDialogModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
      providers:[],
      declarations: [ AllActorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllActorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
