import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error_message!: string;
  success_message!: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) 
  { 
    
  }

  ngOnInit(): void { }

  goRegister() {
    this.router.navigate(['/register']);
  }

  onLogin(form: NgForm) {

    this.success_message = "";
    this.error_message = "";

    const email = form.value.email;
    const password = form.value.password;

    console.log("LoginComponent->onlogin email", email);
    console.log("LoginComponent->onlogin password", password);

    this.authService.login(email, password)
    .then(response => {

      console.log("LoginComponent->onlogin then response", response);
      let refreshToken = response.refreshToken;
      console.log("LoginComponent->onlogin refreshToken", refreshToken);

      this.success_message = `The user has been authenticated in firebase`;

      form.reset();
      
      this.goTripList();
      
    }).catch((err) => {

      console.log("LoginComponent->onlogin catch err", err);
      this.error_message = err.message;

    });

  }

  goTripList() 
  {
    this.router.navigate(['/trip-list']);
  }

}
