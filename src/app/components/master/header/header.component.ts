import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user_email: string = "juan";
  constructor(private authService: AuthService) 
  {
  }

  ngOnInit(): void {

  }

  ngAfterViewChecked()
  {

  }

  logout()
  {

    this.authService.logout()
    .then(response => {

      console.log("HeaderComponent->logout then response", response);

    }).catch((err) => {

      console.log("HeaderComponent->logout catch err", err);

    });

  }

}
