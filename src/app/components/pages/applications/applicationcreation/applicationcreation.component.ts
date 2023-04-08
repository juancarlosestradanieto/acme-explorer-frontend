import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsService } from 'src/app/services/applications.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-applicationcreation',
  templateUrl: './applicationcreation.component.html',
  styleUrls: ['./applicationcreation.component.css']
})
export class ApplicationcreationComponent implements OnInit {

  applicationForm: FormGroup;
  trip_id!: string;

  constructor(private applicationService: ApplicationsService, private authService: AuthService,
    private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router) {
    this.applicationForm = this.createForm();
  }

  createForm() {
    this.trip_id = this.route.snapshot.params['id'];
    let user = this.authService.getCurrentActor();

    let formGroup = this.fb.group({
      status: ['PENDING'],
      trip_Id: [this.trip_id],
      explorer_Id: [user!.id],
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

  goToTripList() {
    this.router.navigate(['/trips/list']);
  }

  ngOnInit(): void {
  }

}
