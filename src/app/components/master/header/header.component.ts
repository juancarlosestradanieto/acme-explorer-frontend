import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Actor } from 'src/app/models/actor.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  protected user: Actor | undefined;
  protected activeRole: string = 'anonymous';
  protected userId: string | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.authService.getStatus().subscribe(loggedIn => {
      if (loggedIn) {
        this.user = this.authService.getCurrentActor();
        console.log("Logged user: " , this.user);
        this.activeRole = this.user.role.toString();
        this.userId = this.user.id.toString();
      } else {
        this.activeRole = 'anonymous';
        this.user = undefined;
        this.userId = undefined;
        console.log("Logged user: " , this.user);
      }
    });
  }

  ngAfterViewChecked() {
    let user_stored = localStorage.getItem('user');
    //console.log("HeaderComponent->ngAfterViewChecked user_stored", user_stored);

    if (user_stored != null) {
      this.user = JSON.parse(user_stored);
      this.cdRef.detectChanges();
    }
  }

  logout() {

    this.authService.logout()
      .then(response => {

        console.log("HeaderComponent->logout then response", response);
        this.goLogin();

      }).catch((err) => {

        console.log("HeaderComponent->logout catch err", err);

      });

  }

  goLogin() {
    this.router.navigate(['/login']);
  }

}
