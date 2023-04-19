import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActorProfileComponent } from './edit-actor-profile.component';

describe('EditActorProfileComponent', () => {
  let component: EditActorProfileComponent;
  let fixture: ComponentFixture<EditActorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditActorProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditActorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
