import { Component, OnInit } from '@angular/core';
import { Actor } from 'src/app/models/actor.model';
import { Application } from 'src/app/models/application.model';
import { ApplicationsService } from 'src/app/services/applications.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-applicationslist',
  templateUrl: './applicationslist.component.html',
  styleUrls: ['./applicationslist.component.css']
})
export class ApplicationslistComponent implements OnInit {

  protected applications: Array<Application> = [];
  cancelledApplications: Array<Application> = [];
  pendingApplications: Array<Application> = [];
  rejectedApplications: Array<Application> = [];
  dueApplications: Array<Application> = [];
  acceptedApplications: Array<Application> = [];

  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';

  constructor(private applicationService: ApplicationsService, private authService: AuthService) {

   }

  ngOnInit(): void {

    this.user = this.authService.getCurrentActor();
    if (this.user) {
      this.activeRole = this.user.role.toString();
    } else {
      this.activeRole = 'anonymous';
    }

    this.getApplications();

  }

  getApplications() {
    if (this.activeRole == "EXPLORER") {
      this.applicationService.getApplicationsByExplorerId(this.user!.id)
      .then((response) => {
        console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId then response ", response);
        this.applications.push(...response);

        console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId this.applications.length ", this.applications.length);

        console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId this.applications ", this.applications);
        for (let index = 0; index < this.applications.length; index++) {
          console.log("Application id -> ", this.applications[index].id);
          console.log("Application status -> ", this.applications[index].status);
        }

        this.cancelledApplications = this.applications.filter(a => a.status == "CANCELLED");
        this.pendingApplications = this.applications.filter(a => a.status == "PENDING");
        this.rejectedApplications = this.applications.filter(a => a.status == "REJECTED");
        this.dueApplications = this.applications.filter(a => a.status == "DUE");
        this.acceptedApplications = this.applications.filter(a => a.status == "ACCEPTED");
      })
      .catch((error) => {
        console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId catch ", error);
      })
    } else if (this.activeRole == "MANAGER") {
      console.log("MANAGER")
    }

  }

}
