import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorProfileEditComponent } from './actor-profile-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}


const actor_id='64389a6c3e8825a22bf403d6';

describe('ActorProfileEditComponent', () => {
  let component: ActorProfileEditComponent;
  let fixture: ComponentFixture<ActorProfileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,HttpClientModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
      declarations: [ ActorProfileEditComponent ],
      providers:[ {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {params: {id: actor_id}}
        }
      },]
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
