import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSponsorshipsComponent } from './trip-sponsorships.component';

describe('TripSponsorshipsComponent', () => {
  let component: TripSponsorshipsComponent;
  let fixture: ComponentFixture<TripSponsorshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripSponsorshipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripSponsorshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
