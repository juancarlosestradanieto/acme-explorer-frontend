import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySponsorshipComponent } from './pay-sponsorship.component';

describe('PaySponsorshipComponent', () => {
  let component: PaySponsorshipComponent;
  let fixture: ComponentFixture<PaySponsorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaySponsorshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaySponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
