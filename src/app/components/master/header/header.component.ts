import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Actor } from 'src/app/models/actor.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected userId!: string | null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    let loggedIn_stored = localStorage.getItem('loggedIn');
    let loggedIn: boolean;
    console.log("HeaderComponent->ngAfterViewChecked user_stored", loggedIn_stored);

    if (loggedIn_stored != null) {
      loggedIn = JSON.parse(loggedIn_stored);
      if (loggedIn) {
        let user_stored = localStorage.getItem('currentActor');
        this.user = JSON.parse(user_stored!);
        //console.log("Logged user: ", this.user);
        this.activeRole = this.user!.role.toString();
        //console.log("Logged user role: ", this.activeRole);
        this.userId = this.user!.id.toString();
        //console.log("Logged user userId: ", this.userId);
      } else {
        this.activeRole = 'anonymous';
        this.user = null;
        this.userId = null;
        //console.log("Logged user: ", this.user);
      }
    }
    /*this.authService.getStatus().subscribe(loggedIn => {
      if (loggedIn) {
        let user_stored = localStorage.getItem('currentActor');
        this.user = JSON.parse(user_stored!);
        //console.log("Logged user: ", this.user);
        this.activeRole = this.user!.role.toString();
        //console.log("Logged user role: ", this.activeRole);
        this.userId = this.user!.id.toString();
        //console.log("Logged user userId: ", this.userId);
      } else {
        this.activeRole = 'anonymous';
        this.user = null;
        this.userId = null;
        //console.log("Logged user: ", this.user);
      }
    });*/
  }

  ngAfterViewChecked() {
    this.ngOnInit();
    /*//let user_stored = localStorage.getItem('user');
    let user_stored = localStorage.getItem('currentActor');
    console.log("HeaderComponent->ngAfterViewChecked user_stored", user_stored);

    if (user_stored != null) {
      this.user = JSON.parse(user_stored);
      if (this.user != null) {
        this.activeRole = this.user!.role.toString();
      this.userId = this.user!.id.toString();
      }
    }*/
    this.cdRef.detectChanges();
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
