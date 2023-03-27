import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripApplicationsComponent } from './trip-applications.component';

describe('TripApplicationsComponent', () => {
  let component: TripApplicationsComponent;
  let fixture: ComponentFixture<TripApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
