import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayTripComponent } from './pay-trip.component';

describe('PayTripComponent', () => {
  let component: PayTripComponent;
  let fixture: ComponentFixture<PayTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
