import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSponsorshipComponent } from './detail-sponsorship.component';

describe('DetailSponsorshipComponent', () => {
  let component: DetailSponsorshipComponent;
  let fixture: ComponentFixture<DetailSponsorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailSponsorshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
