import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorProfileEditComponent } from './actor-profile-edit.component';

describe('ActorProfileEditComponent', () => {
  let component: ActorProfileEditComponent;
  let fixture: ComponentFixture<ActorProfileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorProfileEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
