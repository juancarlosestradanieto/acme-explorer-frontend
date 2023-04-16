import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterManagerComponent } from './register-manager.component';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

describe('RegisterManagerComponent', () => {
  let component: RegisterManagerComponent;
  let fixture: ComponentFixture<RegisterManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterManagerComponent],
      imports:[FormsModule, 
        AngularFireModule.initializeApp(environment.firebase),
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })],
    
      providers: [HttpClient, HttpHandler, AngularFirestore, AngularFireAuth, FormBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
