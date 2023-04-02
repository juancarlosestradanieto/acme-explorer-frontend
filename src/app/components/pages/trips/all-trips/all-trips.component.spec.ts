import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllTripsComponent } from './all-trips.component';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('AllTripsComponent', () => {
  let component: AllTripsComponent;
  let fixture: ComponentFixture<AllTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase)],
      declarations: [ AllTripsComponent ],
      providers: [HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
