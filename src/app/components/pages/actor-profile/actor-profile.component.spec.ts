import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorProfileComponent } from './actor-profile.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActivatedRoute } from '@angular/router';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

let actor_id = '64389a6c3e8825a22bf403d6';
describe('ActorProfileComponent', () => {
  let component: ActorProfileComponent;
  let fixture: ComponentFixture<ActorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
      providers:[ {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {params: {id: actor_id}}
        }
      },],
      declarations: [ ActorProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
