import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm: FormGroup;
  roleList: string[];
  error_message!: string;
  success_message!: string;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.roleList = this.authService.getRoles();
    this.registrationForm = this.createForm();
  }

  ngOnInit(): void { }

  createForm() {

    let production = environment.production;
    console.log("production ", production);

    return this.fb.group({
      name: (production == true) ? '' : 'test',
      surname: (production == true) ? '' : 'test',
      email: (production == true) ? '' : 'test@test.test',
      password: (production == true) ? '' : '123456',
      phone: (production == true) ? '' : 'test',
      address: (production == true) ? '' : 'test',
      role: (production == true) ? [] : ['EXPLORER'],
      validated: true
    });
  }

  onRegister() {

    this.success_message = "";
    this.error_message = "";
     
    this.authService.registerUser(this.registrationForm.value)
    .then((response) => {

      console.log("RegisterComponent->onRegister then response ", response);
      this.success_message = "User registered and logged in successfully"; 
      this.cleanForm();

      this.goToTripList();

    })
    .catch((error) => {

      console.error("RegisterComponent->onRegister error ", error);
      this.error_message = error.message;

    });
      

  }

  cleanForm() {
    this.registrationForm.reset();
  }

  goToTripList() 
  {
    this.router.navigate(['/trip-list']);
  }

}