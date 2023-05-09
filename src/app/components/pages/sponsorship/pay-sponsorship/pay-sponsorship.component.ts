import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { SponsorshipsService } from 'src/app/services/sponsorships.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-pay-sponsorship',
  templateUrl: './pay-sponsorship.component.html',
  styleUrls: ['./pay-sponsorship.component.scss']
})
export class PaySponsorshipComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private sponsorshipService: SponsorshipsService,
    private location:Location,
    private translate: TranslateService) { }

  public payPalConfig?: IPayPalConfig;
  sponsorship_id!: string;

  ngOnInit(): void {
    this.initConfig();
    console.log(this.sponsorship_id)
  }

  private initConfig(): void {
    this.sponsorship_id = this.route.snapshot.params['id'];
    let sponsorshipPrice = this.route.snapshot.queryParams['price'];

    if (sponsorshipPrice == undefined) {
      sponsorshipPrice = 20;
    }

    this.payPalConfig = {
      currency: 'EUR',
      clientId: environment.paypal.PAYPAL_CLIENT_ID,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: sponsorshipPrice
          }
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

        this.sponsorshipService.paySponsorship(this.sponsorship_id)
          .then((response) => {
            console.log("PaysponsorshipComponent-> sponsorshipService.paysponsorship then response ", response);
            this.translate.get('applications.messages.payed-sponsorship')
              .subscribe((message: string) => {
                alert(message);
                this.location.back();
              })
          })
          .catch((error) => {
            console.error("PaysponsorshipComponent-> sponsorshipService.paysponsorship catch ", error);
            this.translate.get('applications.messages.payed-sponsorship-error')
            .subscribe((message: string) => {
              alert(message);
            })
          })
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }
}
