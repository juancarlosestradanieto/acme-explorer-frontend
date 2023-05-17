import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SystemParameters } from 'src/app/models/system-parameters.model';
import { SystemParametersService } from 'src/app/services/system-parameters.service';

@Component({
  selector: 'app-system-parameters-edit',
  templateUrl: './system-parameters-edit.component.html',
  styleUrls: ['./system-parameters-edit.component.scss']
})
export class SystemParametersEditComponent implements OnInit {

  parametersForm: FormGroup;
  systemParameters: SystemParameters;
  pageMode: string;
  pageModes: string[] = ["display", "create", "update"];

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sps: SystemParametersService,
    private translate: TranslateService) {
    this.parametersForm = this.fb.group({
      maxFinderResults: ['', Validators.compose([Validators.required, Validators.min(0)])],
      flatRateSponsorships: ['', Validators.compose([Validators.required, Validators.min(0)])],
      cacheHour: ['', Validators.compose([Validators.required, Validators.min(0)])]
    });
    this.systemParameters = new SystemParameters({});
    this.pageMode = "display";
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log("SystemParametersEditComponent->paramMap params ", params);
      console.log("SystemParametersEditComponent->paramMap params.get(pageMode) ", params.get("pageMode"));
      let mode = params.get("pageMode");
      if (mode == null || mode == undefined || !this.pageModes.includes(mode)) {
        mode = "display";
        this.goToDisplay();
      }
      this.pageMode = mode;

      console.log("SystemParametersEditComponent->pageMode ", this.pageMode);
      this.initializeForm();
    });
  }

  async initializeForm() {
    const getResponse = await this.sps.getSystemParameters()
      .then((response) => {
        console.log("SystemParametersEditComponent->initializeForm SystemParametersService.getSystemParameters then response ", response);
        if (response.hasOwnProperty('systemParameters')) {
          console.log("SystemParametersEditComponent->initializeForm SystemParametersService.getSystemParameters then response.systemParameters ", response.systemParameters);
          return response.systemParameters;
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error("SystemParametersEditComponent->initializeForm SystemParametersService.getSystemParameters catch ", error);
        return null;
      });

    console.log("SystemParametersEditComponent->initializeForm getResponse ", getResponse);

    if (!getResponse) {
      console.log("SystemParametersEditComponent->initializeForm null ", null);
      this.pageMode = "create";
      this.goToCreate();
    } else if (getResponse && this.pageMode == "create") {
      this.goToDisplay();
    }

    if (this.pageMode == "display") {
      this.systemParameters = new SystemParameters(getResponse);
      console.log("SystemParametersEditComponent->pageMode display ", this.pageMode);
      console.log("SystemParametersEditComponent->getResponse ", getResponse);
      console.log("SystemParametersEditComponent->this.systemParameters ", this.systemParameters);

      this.parametersForm.setValue({
        maxFinderResults: this.systemParameters.getMaxFinderResults(),
        flatRateSponsorships: this.systemParameters.getFlatRateSponsorships(),
        cacheHour: this.systemParameters.getCacheHour()
      });

      this.parametersForm.controls['maxFinderResults'].disable();
      this.parametersForm.controls['flatRateSponsorships'].disable();
      this.parametersForm.controls['cacheHour'].disable();

    } else if (this.pageMode == "update") {
      this.systemParameters = new SystemParameters(getResponse);
      console.log("SystemParametersEditComponent->pageMode display ", this.pageMode);
      console.log("SystemParametersEditComponent->getResponse ", getResponse);
      console.log("SystemParametersEditComponent->this.systemParameters ", this.systemParameters);

      this.parametersForm.setValue({
        maxFinderResults: this.systemParameters.getMaxFinderResults(),
        flatRateSponsorships: this.systemParameters.getFlatRateSponsorships(),
        cacheHour: this.systemParameters.getCacheHour()
      });

      this.parametersForm.controls['maxFinderResults'].enable();
      this.parametersForm.controls['flatRateSponsorships'].enable();
      this.parametersForm.controls['cacheHour'].enable();

    }

  }

  onSubmit() {
    if (this.pageMode == "create") {
      this.onCreateSubmit();
    }
    else if (this.pageMode == "update") {
      this.onUpdateSubmit();
    }
  }

  onCreateSubmit() {
    const formModel = this.parametersForm.value;
    this.sps.createSystemParameters(formModel)
      .then((response) => {
        console.log("SystemParametersEditComponent->onCreateSubmit SystemParametersService.createSystemParameters then response ", response);
        this.translate.get('system-parameters.messages.created')
        .subscribe((message: string) => {
          alert(message);
          this.goToDisplay();
        })
      })
      .catch((error) => {
        console.error("SystemParametersEditComponent->onCreateSubmit SystemParametersService.createSystemParameters catch ", error);
      });
  }

  onUpdateSubmit() {
    const formModel = this.parametersForm.value;
    this.sps.updateSystemParameters(formModel)
      .then((response) => {
        console.log("SystemParametersEditComponent->onUpdateSubmit SystemParametersService.updateSystemParameters then response ", response);
        this.translate.get('system-parameters.messages.updated')
        .subscribe((message: string) => {
          alert(message);
          this.goToDisplay();
        })
      })
      .catch((error) => {
        console.error("SystemParametersEditComponent->onUpdateSubmit SystemParametersService.updateSystemParameters catch ", error);
      });
  }

  goToUpdate() {
    this.router.navigate(['/system-parameters/update']);
  }

  goToDisplay() {
    this.router.navigate(['/system-parameters/display']);
  }

  goToCreate() {
    this.router.navigate(['/system-parameters/create']);
  }

}
