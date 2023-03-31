import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationcreationComponent } from './applicationcreation.component';

describe('ApplicationcreationComponent', () => {
  let component: ApplicationcreationComponent;
  let fixture: ComponentFixture<ApplicationcreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationcreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationcreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
