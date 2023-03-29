import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationdisplayComponent } from './applicationdisplay.component';

describe('ApplicationdisplayComponent', () => {
  let component: ApplicationdisplayComponent;
  let fixture: ComponentFixture<ApplicationdisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationdisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
