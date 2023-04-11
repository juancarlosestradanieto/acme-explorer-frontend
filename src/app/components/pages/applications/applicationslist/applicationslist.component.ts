import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Application } from 'src/app/models/application.model';
import { ApplicationsService } from 'src/app/services/applications.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-applicationslist',
  templateUrl: './applicationslist.component.html',
  styleUrls: ['./applicationslist.component.scss']
})
export class ApplicationslistComponent implements OnInit {

  protected applications: Array<Application> = [];
  cancelledApplications: Array<Application> = [];
  pendingApplications: Array<Application> = [];
  rejectedApplications: Array<Application> = [];
  dueApplications: Array<Application> = [];
  acceptedApplications: Array<Application> = [];

  rejectionForm: FormGroup;
  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  protected trip_id!: string;

  constructor(private applicationService: ApplicationsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute) {
    this.rejectionForm = this.createForm();
  }

  ngOnInit(): void {

    this.user = this.authService.getCurrentActor();
    if (this.user) {
      this.activeRole = this.user.getRole().toString();
    } else {
      this.activeRole = 'anonymous';
    }

    this.getApplications();

  }

  createForm() {
    return this.fb.group({
      rejected_reason: ['']
    });
  }

  getApplications() {
    if (this.activeRole == "EXPLORER") {
      this.applicationService.getApplicationsByExplorerId(this.user!.id)
        .then((response) => {
          console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId then response ", response);
          let casted_application = Application.castJsonApplications(response);
          this.applications.push(...casted_application);

          console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId this.applications.length ", this.applications.length);

          console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId this.applications ", this.applications);

          this.cancelledApplications = this.applications.filter(a => a.status == "CANCELLED");
          this.pendingApplications = this.applications.filter(a => a.status == "PENDING");
          this.rejectedApplications = this.applications.filter(a => a.status == "REJECTED");
          this.dueApplications = this.applications.filter(a => a.status == "DUE");
          this.acceptedApplications = this.applications.filter(a => a.status == "ACCEPTED");
        })
        .catch((error) => {
          console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId catch ", error);
        });
    } else if (this.activeRole == "MANAGER") {
      this.trip_id = this.route.snapshot.paramMap.get('id')!;
      this.applicationService.getApplicationsByTripId(this.trip_id)
        .then((response) => {
          console.log("ApplicationslistComponent->constructor authService.getApplicationsByTripId then response ", response);
          let casted_application = Application.castJsonApplications(response);
          this.applications.push(...casted_application);

          console.log("ApplicationslistComponent->constructor authService.getApplicationsByTripId this.applications.length ", this.applications.length);

          console.log("ApplicationslistComponent->constructor authService.getApplicationsByTripId this.applications ", this.applications);

          this.cancelledApplications = this.applications.filter(a => a.status == "CANCELLED");
          this.pendingApplications = this.applications.filter(a => a.status == "PENDING");
          this.rejectedApplications = this.applications.filter(a => a.status == "REJECTED");
          this.dueApplications = this.applications.filter(a => a.status == "DUE");
          this.acceptedApplications = this.applications.filter(a => a.status == "ACCEPTED");
        })
        .catch((error) => {
          console.log("ApplicationslistComponent->constructor authService.getApplicationsByTripId catch ", error);
        });
    }

  }

  onApplicationReject(applicationId: string) {
    console.log("ApplicationslistComponent->constructor applicationService.onApplicationReject rejected_reason ", this.rejectionForm.value.rejected_reason);
    this.applicationService.rejectApplication(applicationId, this.rejectionForm.value.rejected_reason).
      then(() => {
        this.ngOnInit();
      }).catch((error: any) => {
        console.log("ApplicationslistComponent->constructor applicationService.onApplicationReject catch ", error);
      })
  }

  onApplicationAccept(applicationId: string) {
    this.applicationService.acceptApplication(applicationId).
      then(() => {
        this.ngOnInit();
      }).catch((error: any) => {
        console.log("ApplicationslistComponent->constructor applicationService.onApplicationAccept catch ", error);
      })
  }

}
