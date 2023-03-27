import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorProfileComponent } from './actor-profile.component';

describe('ActorProfileComponent', () => {
  let component: ActorProfileComponent;
  let fixture: ComponentFixture<ActorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
