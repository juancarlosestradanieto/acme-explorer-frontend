import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: any;

  constructor (
    private authService: AuthService, 
    private router: Router,
    private cdRef:ChangeDetectorRef
  ) 
  {
  }

  ngOnInit(): void {

  }

  ngAfterViewChecked()
  {
    let user_stored = localStorage.getItem('user');
    //console.log("HeaderComponent->ngAfterViewChecked user_stored", user_stored);

    if(user_stored != null)
    {
      this.user = JSON.parse(user_stored);
      this.cdRef.detectChanges();
    }
  }

  logout()
  {

    this.authService.logout()
    .then(response => {

      console.log("HeaderComponent->logout then response", response);
      this.goLogin();

    }).catch((err) => {

      console.log("HeaderComponent->logout catch err", err);

    });

  }

  goLogin() 
  {
    this.router.navigate(['/login']);
  }

}
