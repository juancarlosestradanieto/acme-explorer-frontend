import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSponsorshipComponent } from './edit-sponsorship.component';

describe('EditSponsorshipComponent', () => {
  let component: EditSponsorshipComponent;
  let fixture: ComponentFixture<EditSponsorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSponsorshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
