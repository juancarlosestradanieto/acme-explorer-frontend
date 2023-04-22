import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    let user = this.authService.getCurrentActor();

    let formGroup = this.fb.group({
      status: ['PENDING'],
      trip_Id: [this.trip_id],
      explorer_Id: [user!.id],
      tripPrice: [this.trip.getPrice()],
      comments: this.fb.array([
        this.fb.control('')
      ])
    });

    return formGroup;
  }

  get comments() {
    return this.applicationForm.get('comments') as FormArray;
  }

  addComment() {
    this.comments.push(this.fb.control(''));
  }

  removeComment(index: number) {
    this.comments.removeAt(index);
  }

  onApplicationSubmit() {

    this.applicationService.createApplication(this.applicationForm.value)
      .then((response) => {

        console.log("ApplicationcreationComponent->onApplicationSubmit then response ", response);
        this.applicationForm.reset();

        this.goToTripList();

      })
      .catch((error) => {

        console.error("ApplicationcreationComponent->onApplicationSubmit error ", error);

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

  goToTripList() {
    this.router.navigate(['/trips/list']);
  }

  ngOnInit(): void {
  }

}
