import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationslistComponent } from './applicationslist.component';

describe('ApplicationslistComponent', () => {
  let component: ApplicationslistComponent;
  let fixture: ComponentFixture<ApplicationslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
