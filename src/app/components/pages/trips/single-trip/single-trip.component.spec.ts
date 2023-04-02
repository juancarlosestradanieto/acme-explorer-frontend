import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SingleTripComponent } from './single-trip.component';
import { ActivatedRoute } from '@angular/router';

describe('SingleTripComponent', () => {
  let component: SingleTripComponent;
  let fixture: ComponentFixture<SingleTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTripComponent ],
      providers: [
        HttpClient, 
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: {id: '1'}}
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
