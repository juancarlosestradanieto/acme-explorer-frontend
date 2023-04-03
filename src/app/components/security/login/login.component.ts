import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error_message!: string;
  success_message!: string;
  private returnUrl!: string;

  @ViewChild(NgForm)
  f!: NgForm;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void { 
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  onLogin(form: NgForm) {

    console.log("Formulario de login -> ", form)

    this.success_message = "";
    this.error_message = "";

    const email = form.value.email;
    const password = form.value.password;

    console.log("LoginComponent->onlogin email", email);
    console.log("LoginComponent->onlogin password", password);

    this.authService.login(email, password);
    /*
    this.authService.login(email, password)
      .then(response => {

        console.log("LoginComponent->onlogin then response", response);
        let refreshToken = response.refreshToken;
        console.log("LoginComponent->onlogin refreshToken", refreshToken);

        this.success_message = `The user has been authenticated in firebase`;

        form.reset();

        console.log("LoginComponent->returning to", this.returnUrl);

        this.router.navigateByUrl(this.returnUrl);

        //this.goToTripList();

      }).catch((err) => {

        console.log("LoginComponent->onlogin catch err", err);
        this.error_message = err.message;

      });
      */

  }

  goToTripList() {
    this.router.navigate(['/trip-list']);
  }

}
