import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCancelComponent } from './pre-cancel.component';

describe('PreCancelComponent', () => {
  let component: PreCancelComponent;
  let fixture: ComponentFixture<PreCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
