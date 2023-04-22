import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ApplicationsService } from 'src/app/services/applications.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payapplication',
  templateUrl: './payapplication.component.html',
  styleUrls: ['./payapplication.component.scss']
})
export class PayapplicationComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private applicationService: ApplicationsService,
    private router: Router) { }

  public payPalConfig ? : IPayPalConfig;

  application_id!: string;


  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.application_id = this.route.snapshot.params['id'];
    let tripPrice = this.route.snapshot.queryParams['price'];
    
    if (tripPrice == undefined) {
      tripPrice = 20;
    }

    this.payPalConfig = {
        currency: 'EUR',
        clientId: environment.paypal.PAYPAL_CLIENT_ID,
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: tripPrice
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
            //alert("{{'buttons.go_to_trip' | translate}}");
            this.applicationService.payApplication(this.application_id)
            .then((response) => {
              console.log("PayapplicationComponent-> applicationService.payApplication then response ", response);
              this.router.navigate(['/applications/']);
            })      
            .catch((error) => {
              console.error("PayapplicationComponent-> applicationService.payApplication catch ", error);
      
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
