import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) 
  { 

  }

  ngOnInit(): void {
  }

  logout()
  {

    this.authService.logout()
    .then(response => {

      console.log("LoginComponent->onlogin then response", response);

    }).catch((err) => {

      console.log("LoginComponent->onlogin catch err", err);

    });
    
  }

}
