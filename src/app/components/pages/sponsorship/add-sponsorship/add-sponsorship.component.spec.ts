import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSponsorshipComponent } from './add-sponsorship.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

let sponsorId = "64392c693e8825a22bf40470";

describe('AddSponsorshipComponent', () => {
  let component: AddSponsorshipComponent;
  let fixture: ComponentFixture<AddSponsorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[FormsModule,HttpClientModule,ReactiveFormsModule],
      declarations: [ AddSponsorshipComponent ],
      providers: [FormBuilder ,{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {params: {id: sponsorId}}
        }
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
