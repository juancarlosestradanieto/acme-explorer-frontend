import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm: FormGroup;
  roleList: string[];

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
    return this.fb.group({
      name: [''],
      surname: [''],
      email: [''],
      password: [''],
      phone: [''],
      address: [''],
      role: [''],
      validated: ['true']
    });
  }

  onRegister() {

    this.authService.registerUser(this.registrationForm.value)
      .then(res => {
        console.log(res);
        window.alert('Registro Realizado Correctamente!');
        this.cleanForm();
        this.goLogin();

      }, err => {
        console.log(err);
      });

  }

  cleanForm() {
    this.registrationForm.reset();
  }

  //!Esto se cambiará en el futuro, ya que una vez que te registrar no será necesario ir al Login...o no (por ver)
  goLogin() {
    this.router.navigate(['/login']);
  }

}