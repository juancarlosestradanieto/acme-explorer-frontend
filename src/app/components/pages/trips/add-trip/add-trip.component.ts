import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TripsService } from 'src/app/services/trips.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {

  tripForm;
  error_message!: string;
  success_message!: string;
  production: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private tripService: TripsService,
    private router: Router
  )
  { 
    this.production = environment.production;
    console.log("this.production ", this.production);
    this.tripForm = this.createForm();
  }

  ngOnInit(): void {
  }

  createForm()
  {
    let currectActor = this.authService.getCurrentActor();
    console.log("currectActor ", currectActor);
    let production = this.production;

    return this.fb.group({
      title: [ ((production == true) ? '' : 'test') , Validators.required],
      description: [ ((production == true) ? '' : 'test') , Validators.required],
      price: [ ((production == true) ? '' : 125) , [Validators.required, Validators.min(1), Validators.max(999999)]],
      requirements: this.fb.array([
        //uncomment next line to initialize with one element
        this.getRequirement()
      ]),
      startDate: [ ((production == true) ? '' : '2023-04-05') , Validators.required],
      endDate: [ ((production == true) ? '' : '2023-04-05') , Validators.required],
      publicationDate: [ ((production == true) ? '' : '2023-04-05') , Validators.required],
      pictures: this.fb.array([
        //uncomment next line to initialize with one element
        this.getPicture()
      ]),
      stages: this.fb.array([
        //uncomment next line to initialize with one element
        this.getStage()
      ]),
      managerId: [currectActor?.id, Validators.required],
    });
  }

  private getRequirement()
  {
    let production = this.production;

    return this.fb.group({
      requirement: [ ((production == true) ? '' : 'test') , Validators.required],
    });
  }

  onAddRequirement() {
    const control = <FormArray>this.tripForm.controls['requirements'];
    control.push(this.getRequirement());
  }

  onRemoveRequirement(i: number) {
    const control = <FormArray>this.tripForm.controls['requirements'];
    control.removeAt(i);
  }

  private getStage()
  {
    let production = this.production;

    return this.fb.group({
      title: [ ((production == true) ? '' : 'test') , Validators.required],
      description: [ ((production == true) ? '' : 'test') , Validators.required],
      price: [ ((production == true) ? '' : 125) , [Validators.required, Validators.min(1), Validators.max(999999)]],
    });
  }

  onAddStage() {
    const control = <FormArray>this.tripForm.controls['stages'];
    control.push(this.getStage());
  }

  onRemoveStage(i: number) {
    const control = <FormArray>this.tripForm.controls['stages'];
    control.removeAt(i);
  }

  private getPicture()
  {
    let production = this.production;

    return this.fb.group({
      picture: [ '' , Validators.required],
    });
  }

  onAddPicture() {
    const control = <FormArray>this.tripForm.controls['pictures'];
    control.push(this.getPicture());
  }

  onRemovePicture(i: number) {
    const control = <FormArray>this.tripForm.controls['pictures'];
    control.removeAt(i);
  }

  onSubmit()
  {
    let formData = this.tripForm.value;

    //console.log("formData", formData);
    let original_requirements = formData.requirements;
    //console.log(original_requirements);
    var formatted_requirements = Object.keys(original_requirements!)
    .map(function (key: any) { 
      return original_requirements![key]["requirement"];
    });
    //console.log(formatted_requirements);
    let newFormaData = JSON.parse(JSON.stringify(formData));
    newFormaData["requirements"] = formatted_requirements;
    //console.log("newFormaData ", newFormaData);
    
    this.tripService.createTrip(newFormaData)
    .then((response) => {

      console.log("AddTripComponent->onSubmit then response ", response);

      this.tripForm.reset();
      this.goToTripList();

    })
    .catch((error) => {

      console.error("AddTripComponent->onSubmit error ", error);

    });
  }

  goToTripList() {
    this.router.navigate(['/trips/list']);
  }

}
