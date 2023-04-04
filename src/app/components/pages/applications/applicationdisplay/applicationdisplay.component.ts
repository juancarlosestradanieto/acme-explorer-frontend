import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Application } from 'src/app/models/application.model';
import { ApplicationsService } from 'src/app/services/applications.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-applicationdisplay',
  templateUrl: './applicationdisplay.component.html',
  styleUrls: ['./applicationdisplay.component.css']
})
export class ApplicationdisplayComponent implements OnInit {

  application!: Application;
  application_id!: string;

  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';

  constructor(private applicationService: ApplicationsService, private route:ActivatedRoute, private authService: AuthService) { 

    this.user = this.authService.getCurrentActor();
    if (this.user) {
      this.activeRole = this.user.getRole().toString();
    } else {
      this.activeRole = 'anonymous';
    }

    this.application_id = this.route.snapshot.paramMap.get('id')!;
    console.log("this.application_id -> ", this.application_id);

    applicationService.getApplicationById(this.application_id)
    .then((response) => {
      console.log("ApplicationdisplayComponent -> constructor applicationService.getApplicationById then ", response);
      this.application = response;
    })
    .catch((error) => {
      console.error("ApplicationdisplayComponent -> constructor applicationService.getApplicationById error ", error);
    })
  }

  ngOnInit(): void {
  }

}
