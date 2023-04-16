import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterManagerService } from 'src/app/services/register-manager.service';


@Component({
  selector: 'app-register-manager',
  templateUrl: './register-manager.component.html',
  styleUrls: ['./register-manager.component.scss']
})
export class RegisterManagerComponent implements OnInit {

  registrationForm: FormGroup;
  error_message!: string;
  success_message!: string;
  
  constructor(
    private _registerManagerService: RegisterManagerService ,
    private fb: FormBuilder,
    private router:Router) 
    { 
      
      this.registrationForm = this.createForm();
    }

              

  ngOnInit(): void {
  }


  createForm() {

    return this.fb.group({
      name: ['Wakan',Validators.required],
      surname: ['Diano', Validators.required],
      email: ['WakanManager@elplan.es',[Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      password: ['1234567890', [Validators.required, Validators.minLength(10)]],
      phone_number: ['698231406',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{9}$")]],
      address: ['Plaza Mozambique',Validators.required],
      role: ['MANAGER'],
      isActive: [true]
    });
  }

  onRegister() {

    this.success_message = "";
    this.error_message = "";
     
    this._registerManagerService.registerUserManager(this.registrationForm.value)
    .then((response) => {

      console.log("RegisterComponent->onRegister then response ", response);
      
      this.success_message = "User with email '"+response.email+"' registered successfully"; 
     
      setTimeout(()=>{
        this.goPanelActors();
      },500)
      

    })
    .catch((error) => {

      console.error("Register-Manager-Component->onRegister error ", error);
        
      this.error_message = error.message;

      console.error("Register-Manager-Component->onRegister error.status ", error.status);
      console.error("Register-Manager-Component->onRegister error.error.message ", error.error.message);
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

  // cleanForm() {
  //   this.registrationForm.reset();
  // }

  goPanelActors(){
    this.router.navigate(['/all-actors']);
  }



}
