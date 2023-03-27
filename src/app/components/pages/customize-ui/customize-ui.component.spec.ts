import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeUiComponent } from './customize-ui.component';

describe('CustomizeUiComponent', () => {
  let component: CustomizeUiComponent;
  let fixture: ComponentFixture<CustomizeUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizeUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizeUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
