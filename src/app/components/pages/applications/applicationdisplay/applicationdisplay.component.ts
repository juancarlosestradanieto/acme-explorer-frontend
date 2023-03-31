import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application } from 'src/app/models/application.model';
import { ApplicationsService } from 'src/app/services/applications.service';

@Component({
  selector: 'app-applicationdisplay',
  templateUrl: './applicationdisplay.component.html',
  styleUrls: ['./applicationdisplay.component.css']
})
export class ApplicationdisplayComponent implements OnInit {

  application!: Application;
  application_id!: string;

  constructor(private applicationService: ApplicationsService, private route:ActivatedRoute) { 
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
