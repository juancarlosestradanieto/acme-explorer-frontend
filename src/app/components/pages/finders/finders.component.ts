import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Finder } from 'src/app/models/finder/finder.model';
import { FinderConfig, FindersService } from 'src/app/services/finders/finders.service';
import { SystemParametersService } from 'src/app/services/system-parameters.service';

@Component({
  selector: 'app-finders',
  templateUrl: './finders.component.html',
  styleUrls: ['./finders.component.scss']
})
export class FindersComponent implements OnInit {

  finderConfigForm;
  success_message!: string;
  protected actorId!: string;
  finders: Array<Finder>;

  constructor(
    private fb: FormBuilder,
    private findersService: FindersService
  ) 
  {
    this.finderConfigForm = this.createForm();
    this.getFinderConfig();
  }

  ngOnInit(): void {

    let local_stored_actor = localStorage.getItem("currentActor");
    if(local_stored_actor != null)
    {
      let actor = JSON.parse(local_stored_actor);
      if(actor != null)
      {
        this.actorId = actor._id;
      }
    }

    this.getExplorerFinders();

  }

  createForm()
  {
    return this.fb.group(
      {
        maxFinderResults: ["", [Validators.required, Validators.min(1), Validators.max(100)]],
        cacheHour: ["", [Validators.required, Validators.min(1), Validators.max(24)]],
      }
    );
  }

  setFinderConfig()
  {
    let formData = this.finderConfigForm.value;
    //console.log("formData", formData);

    let finderConfig: FinderConfig = {
      maxFinderResults: formData.maxFinderResults,
      cacheHour: formData.cacheHour
    }

    this.findersService.setFinderConfig(finderConfig);

    this.success_message = "finders.messages.finder-saved";
  }

  getFinderConfig()
  {

    this.findersService.getFinderConfig()
    .then((response) => {
      console.log("FindersComponent->getFinderConfig then response ", response);
      let finderConfig = response as FinderConfig;
      this.finderConfigForm.controls.maxFinderResults.setValue(finderConfig.maxFinderResults);
      this.finderConfigForm.controls.cacheHour.setValue(finderConfig.cacheHour);

    })
    .catch((error) => {
      console.error("FindersComponent->getFinderConfig catch ", error);
    });

  }

  getExplorerFinders()
  {
    let explorer_Id = this.actorId;

    this.findersService.getExplorerFinders(explorer_Id)
    .then((response: any) => {

      console.log("FindersComponent->getExplorerFinders findersService.getExplorerFinders then response ", response);
      let status = response.status; 
      if(status == 204)//No finder was found
      {
        //this.search();
      }
      else if(status == 200)//finder found
      {
        let finders = Finder.castJsonFinders(response.body);
        //console.log("finders ", finders);
        this.finders = finders;
        
      }


    })
    .catch((error: any) => {

      console.error("FindersComponent->getExplorerFinders findersService.getExplorerFinders catch ", error);

    });
  }

}
