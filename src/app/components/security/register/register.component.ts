import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
      name: [(production == true) ? '' : 'test',Validators.required],
      surname: [(production == true) ? '' : 'test', Validators.required],
      email: [(production == true) ? '' : 'test'+(new Date().getTime())+'@gmail.com',[Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      password: [(production == true) ? '' : '1234567890', [Validators.required, Validators.minLength(10)]],
      phone_number: [(production == true) ? '' : '123456789',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{9}$")]],
      address: [(production == true) ? '' : 'test',Validators.required],
      role: [(production == true) ? [] : ['EXPLORER']],
      isActive: [true]
    });
  }

  onRegister() {

    this.success_message = "";
    this.error_message = "";
     
    this.authService.registerUser(this.registrationForm.value)
    .then((response) => {

      console.log("RegisterComponent->onRegister then response ", response);
      
      this.success_message = "User with email '"+response.email+"' registered successfully"; 
      
      this.cleanForm();

    })
    .catch((error) => {

      console.error("RegisterComponent->onRegister error ", error);
        
      this.error_message = error.message;

      console.error("RegisterComponent->onRegister error.status ", error.status);
      console.error("RegisterComponent->onRegister error.error.message ", error.error.message);
      if(error.status === 422 && typeof error.error.message !== 'undefined')
      {
        this.error_message = error.error.message;
      }
      if(error.status === 403 && typeof error.error !== 'undefined')
      {
        this.error_message = error.error;
      }

    });
      

  }

  cleanForm() {
    this.registrationForm.reset();
  }

  goToTripList() 
  {
    this.router.navigate(['/trips/list']);
  }

}