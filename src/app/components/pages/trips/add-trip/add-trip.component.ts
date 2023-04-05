import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {

  tripForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(1), Validators.max(999999)]],
    //requirements: ['', Validators.required],
    requirements: this.fb.array([
      // this.getRequirement()
    ]),
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    publicationDate: ['', Validators.required],
    pictures: ['', Validators.required],
    //stages: ['', Validators.required],
    stages: this.fb.array([
      // this.getStage()
    ]),
    managerId: ['', Validators.required],
  });
  error_message!: string;
  success_message!: string;

  constructor(private fb: FormBuilder)
  { 

  }

  ngOnInit(): void {
  }

  private getRequirement()
  {
    return this.fb.group({
      requirement: ['', Validators.required],
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
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1), Validators.max(999999)]],
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

  onSubmit()
  {
    console.log("this.tripForm.value", this.tripForm.value);
    
  }

}
