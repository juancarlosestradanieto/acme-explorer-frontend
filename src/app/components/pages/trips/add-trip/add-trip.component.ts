import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {

  tripForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    requirements: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    publicationDate: ['', Validators.required],
    pictures: ['', Validators.required],
    stages: ['', Validators.required],
    managerId: ['', Validators.required],
  });
  error_message!: string;
  success_message!: string;

  constructor(private fb: FormBuilder)
  { 

  }

  ngOnInit(): void {
  }

  onSubmit()
  {
    console.log("this.tripForm.value", this.tripForm.value);
    
  }

}
