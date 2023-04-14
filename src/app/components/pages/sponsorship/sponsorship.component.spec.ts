import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorshipComponent } from './sponsorship.component';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('SponsorshipComponent', () => {
  let component: SponsorshipComponent;
  let fixture: ComponentFixture<SponsorshipComponent>;
  let id="64392ab53e8825a22bf4043c"

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient, HttpHandler, {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {params: {id: id}}
        }
      }],
      declarations: [ SponsorshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
