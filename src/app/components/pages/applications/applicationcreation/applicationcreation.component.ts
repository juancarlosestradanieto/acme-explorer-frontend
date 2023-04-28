import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Application } from 'src/app/models/application.model';
import { Trip } from 'src/app/models/trip.model';
import { ApplicationsService } from 'src/app/services/applications.service';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips/trips.service';

@Component({
  selector: 'app-applicationcreation',
  templateUrl: './applicationcreation.component.html',
  styleUrls: ['./applicationcreation.component.css']
})
export class ApplicationcreationComponent implements OnInit {

  applicationForm: FormGroup;
  trip_id!: string;

  trip!: Trip;
  json_trip: any;

  protected user!: Actor | null;

  application_exists: boolean = false;

  application_created: boolean = false;

  constructor(private tripService: TripsService, private applicationService: ApplicationsService, private authService: AuthService,
    private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router) {
    this.trip_id = this.route.snapshot.params['id'];
    this.applicationForm = this.fb.group({
      status: ['PENDING'],
      trip_Id: [''],
      explorer_Id: [''],
      tripPrice: [''],
      comments: this.fb.array([
        this.fb.control('')
      ])
    });
    this.getTrip();
  }

  createForm() {
    this.user = this.authService.getCurrentActor();

    let formGroup = this.fb.group({
      status: ['PENDING'],
      trip_Id: [this.trip_id],
      explorer_Id: [this.user!.id],
      tripPrice: [this.trip.getPrice()],
      comments: this.fb.array([
        this.fb.control('', Validators.required)
      ])
    });

    return formGroup;
  }

  get comments(): FormArray {
    return this.applicationForm.get('comments') as FormArray;
  }

  addComment() {
    this.comments.push(this.fb.control('', Validators.required));
  }

  removeComment(index: number) {
    this.comments.removeAt(index);
  }

  onApplicationSubmit() {

    this.applicationService.getApplicationsByExplorerId(this.user!.id)
      .then((response) => {
        console.log("ApplicationcreationComponent->onApplicationSubmit getApplicationsByExplorerId then response ", response);
        let casted_application = Application.castJsonApplications(response);
        this.application_exists = casted_application.filter((application: Application) => application.trip_Id == this.trip_id).length > 0;

        console.log("ApplicationcreationComponent->onApplicationSubmit getApplicationsByExplorerId then application_exists ", this.application_exists);
      
      if (!this.application_exists) {
        this.applicationService.createApplication(this.applicationForm.value)
        .then((response) => {
  
          console.log("ApplicationcreationComponent->onApplicationSubmit then response ", response);
          this.applicationForm.reset();

          this.application_created = true;
  
        })
        .catch((error) => {
  
          console.error("ApplicationcreationComponent->onApplicationSubmit error ", error);
  
        });
      }
      
      
      })
      .catch((error) => {
        console.log("ApplicationcreationComponent->onApplicationSubmit getApplicationsByExplorerId catch ", error);
      });
  }

  async getTrip() {
    await this.tripService.getSingleTrip(this.trip_id)
      .then((response) => {

        console.log("ApplicationcreationComponent->constructor tripsService.getSingleTrip then response ", response);
        this.json_trip = response;
        console.log("this.json_trip", this.json_trip);

        let casted_trip: Trip = Trip.castJsonTrip(this.json_trip);
        this.trip = casted_trip;
        this.applicationForm = this.createForm();
      })
      .catch((error) => {
        console.error("ApplicationcreationComponent->constructor tripsService.getSingleTrip catch ", error);

      });
  }

  ngOnInit(): void {
  }

}
