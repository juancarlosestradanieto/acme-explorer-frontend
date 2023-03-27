import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindersComponent } from './finders.component';

describe('FindersComponent', () => {
  let component: FindersComponent;
  let fixture: ComponentFixture<FindersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
