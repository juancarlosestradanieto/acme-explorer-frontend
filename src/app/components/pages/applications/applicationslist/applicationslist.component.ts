import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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

  @ViewChild('cancelledTable') cancelledTable: any;
  @ViewChild('rejectedTable') rejectedTable: any;
  @ViewChild('pendingTable') pendingTable: any;
  @ViewChild('dueTable') dueTable: any;
  @ViewChild('dueTable') acceptedTable: any;

  applications: Array<Application> = [];
  cancelledApplications: Array<Application> = [];
  pendingApplications: Array<Application> = [];
  rejectedApplications: Array<Application> = [];
  dueApplications: Array<Application> = [];
  acceptedApplications: Array<Application> = [];

  protected user!: Actor | null;
  protected activeRole: string = 'anonymous';
  trip_id!: string;

  error_message: string = "";

  @ViewChild(NgForm)
  f!: NgForm;

  constructor(private applicationService: ApplicationsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService) {
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

  getApplications() {
    if (this.activeRole == "EXPLORER") {
      this.applicationService.getApplicationsByExplorerId(this.user!.id)
        .then((response) => {
          console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId then response ", response);
          let casted_application = Application.castJsonApplications(response);
          this.applications.push(...casted_application);

          //console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId this.applications.length ", this.applications.length);

          //console.log("ApplicationslistComponent->constructor authService.getApplicationsByExplorerId this.applications ", this.applications);

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

          //console.log("ApplicationslistComponent->constructor authService.getApplicationsByTripId this.applications.length ", this.applications.length);

          //console.log("ApplicationslistComponent->constructor authService.getApplicationsByTripId this.applications ", this.applications);

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

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route
    })
  }

  onApplicationReject(applicationId: string, rejectionForm: NgForm) {
    this.translate.get('applications.messages.reject-application-confirmation')
      .subscribe((message: string) => {
        if (confirm(message)) {
          this.applicationService.rejectApplication(applicationId, rejectionForm.value.rejected_reason).
            then(() => {
              this.reloadPage();
            }).catch((error: any) => {
              console.log("ApplicationslistComponent->constructor applicationService.onApplicationReject catch ", error);
              this.translate.get('applications.messages.reject-application-error')
                .subscribe((message: string) => {
                  this.error_message = message;
                })
            })
        }
      })
  }

  onApplicationAccept(applicationId: string) {
    this.translate.get('applications.messages.accept-application-confirmation')
      .subscribe((message: string) => {
        if (confirm(message)) {
          this.applicationService.acceptApplication(applicationId).
            then(() => {
              this.reloadPage();
            }).catch((error: any) => {
              console.log("ApplicationslistComponent->constructor applicationService.onApplicationAccept catch ", error);
              this.translate.get('applications.messages.accept-application-error')
                .subscribe((message: string) => {
                  this.error_message = message;
                })
            })
        }
      })
  }

  onApplicationCancel(applicationId: string) {
    this.translate.get('applications.messages.cancel-application-confirmation')
      .subscribe((message: string) => {
        if (confirm(message)) {
          this.applicationService.cancelApplication(applicationId).
            then(() => {
              this.reloadPage();
            }).catch((error: any) => {
              console.log("ApplicationslistComponent->constructor applicationService.onApplicationCancel catch ", error);
              this.translate.get('applications.messages.cancel-application-error')
                .subscribe((message: string) => {
                  this.error_message = message;
                })
            })
        }
      })
  }

  onApplicationPay(application: Application) {
    console.log("onApplicationPay -> application", application)
    this.router.navigate(['/applications/' + application.id + '/pay'],
      { queryParams: { price: application.tripPrice } });
  }

  toggleExpandCancelledRow(row: any) {
    this.cancelledTable.rowDetail.toggleExpandRow(row);
  }

  toggleExpandRejectedRow(row: any) {
    this.rejectedTable.rowDetail.toggleExpandRow(row);
  }

  toggleExpandPendingRow(row: any) {
    this.pendingTable.rowDetail.toggleExpandRow(row);
  }

  toggleExpandDueRow(row: any) {
    this.dueTable.rowDetail.toggleExpandRow(row);
  }

  toggleExpandAcceptedRow(row: any) {
    this.acceptedTable.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle($event: any) {

  }

}
