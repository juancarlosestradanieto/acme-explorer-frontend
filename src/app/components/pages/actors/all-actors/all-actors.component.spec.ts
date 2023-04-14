import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllActorsComponent } from './all-actors.component';

describe('AllActorsComponent', () => {
  let component: AllActorsComponent;
  let fixture: ComponentFixture<AllActorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllActorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllActorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
