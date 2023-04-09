import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { S3UploadService } from 'src/app/services/s3-upload/s3-upload.service';
import { TripsService } from 'src/app/services/trips/trips.service';
import { environment } from 'src/environments/environment';
import { forEachChild } from 'typescript';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

export interface CustomFileToUpload
{
  path: string;
  file: File;
}

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {

  tripForm;
  error_message!: string;
  success_message!: string;
  production: boolean = false;
  files: Array<File> = [];
  filesToUpload: Array<CustomFileToUpload> = [];
  created_trip!: Trip;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private tripService: TripsService,
    private router: Router,
    private s3UploadService: S3UploadService
  )
  { 
    this.production = environment.production;
    console.log("this.production ", this.production);
    this.tripForm = this.createForm();
  }

  ngOnInit(): void {
  }

  createForm()
  {
    let currectActor = this.authService.getCurrentActor();
    console.log("currectActor ", currectActor);
    let production = this.production;

    return this.fb.group({
      title: [ ((production == true) ? '' : 'test') , Validators.required],
      description: [ ((production == true) ? '' : 'test') , Validators.required],
      price: [ ((production == true) ? '' : 125) , [Validators.required, Validators.min(1), Validators.max(999999)]],
      requirements: this.fb.array([
        //uncomment next line to initialize with one element
        this.getRequirement()
      ]),
      startDate: [ ((production == true) ? '' : '2023-04-05') , Validators.required],
      endDate: [ ((production == true) ? '' : '2023-04-05') , Validators.required],
      publicationDate: [''],
      pictures: this.fb.array([
        //uncomment next line to initialize with one element
        this.getPicture()
      ]),
      stages: this.fb.array([
        //uncomment next line to initialize with one element
        this.getStage()
      ]),
      managerId: [currectActor?.id, Validators.required],
    });
  }

  private getRequirement()
  {
    let production = this.production;

    return this.fb.group({
      requirement: [ ((production == true) ? '' : 'test') , Validators.required],
    });
  }

  onAddRequirement() {
    const control = <FormArray>this.tripForm.controls['requirements'];
    control.push(this.getRequirement());
  }

  onRemoveRequirement(i: number) {
    const control = <FormArray>this.tripForm.controls['requirements'];
    control.removeAt(i);
  }

  private getStage()
  {
    let production = this.production;

    return this.fb.group({
      title: [ ((production == true) ? '' : 'test') , Validators.required],
      description: [ ((production == true) ? '' : 'test') , Validators.required],
      price: [ ((production == true) ? '' : 125) , [Validators.required, Validators.min(1), Validators.max(999999)]],
    });
  }

  onAddStage() {
    const control = <FormArray>this.tripForm.controls['stages'];
    control.push(this.getStage());
  }

  onRemoveStage(i: number) {
    const control = <FormArray>this.tripForm.controls['stages'];
    control.removeAt(i);
  }

  private getPicture()
  {
    return this.fb.group({
      picture: [ '' , Validators.required],
    });
  }

  onAddPicture() {
    const control = <FormArray>this.tripForm.controls['pictures'];
    control.push(this.getPicture());
  }

  onRemovePicture(i: number) {
    const control = <FormArray>this.tripForm.controls['pictures'];
    control.removeAt(i);
    this.files.splice(i, 1);
    console.log("this.files ", this.files);
    
  }

  selectFile(event: Event, i: number)
  {

    let casted_event = event as HTMLInputEvent;
    
    let filesList: FileList | null = casted_event.target.files;
    const fileToUpload = filesList?.item(0);
    console.log("fileToUpload "+fileToUpload);
    console.log("fileToUpload?.name "+fileToUpload?.name);

    if (casted_event != null && casted_event.target != null && fileToUpload != null) 
    {
      var reader = new FileReader();
      reader.readAsDataURL(fileToUpload);
      reader.onload = () => {
        let image_element = document.getElementById("picture-previsualization\["+i+"\]");
        let test = reader.result as string;
        image_element?.setAttribute("src", test);
      };

      this.files[i] = fileToUpload;
      console.log("this.files ", this.files);

    }
    
  }

  onSubmit()
  {
    let formData = this.tripForm.value;

    //console.log("formData", formData);
    let original_requirements = formData.requirements;
    //console.log(original_requirements);
    var formatted_requirements = Object.keys(original_requirements!)
    .map(function (key: any) { 
      return original_requirements![key]["requirement"];
    });
    //console.log(formatted_requirements);
    let newFormaData = JSON.parse(JSON.stringify(formData));
    newFormaData["requirements"] = formatted_requirements;
    //console.log("newFormaData ", newFormaData);

    let publicationDate = formData.publicationDate;
    newFormaData["publicationDate"] = null;
    
    this.tripService.createTrip(newFormaData)
    .then((response1) => {

      console.log("AddTripComponent->onSubmit then response1 ", response1);

      this.created_trip = new Trip(response1);
      console.log("this.created_trip ", this.created_trip);

      this.uploadFiles()    
      .then((response2) => {

        console.log("AddTripComponent->onSubmit->uploadFiles then response ", response2);
        let responses = response2.responses;

        let pictures: Array<any> = [];
        responses.forEach((response: any) => {
          pictures.push({picture: response.Location});
        });
        console.log("pictures ", pictures);
        this.created_trip.setPictures(pictures);
        this.created_trip.setPublicationDate(new Date(publicationDate!));
        console.log("this.created_trip ", this.created_trip);

        this.tripService.updateTrip(this.created_trip)
        .then((response3) => {

          console.log("AddTripComponent->onSubmit->uploadFiles->updateTrip then response3 ", response3);

        })
        .catch((error3) => {
    
          console.error("AddTripComponent->onSubmit->uploadFiles->updateTrip error3 ", error3);
    
        });
       
        this.tripForm.reset();
        this.goToTripList();
  
      })
      .catch((error2) => {
  
        console.error("AddTripComponent->onSubmit->uploadFiles error2 ", error2);
  
      });

    })
    .catch((error1) => {

      console.error("AddTripComponent->onSubmit error1 ", error1);

    });
  }

  uploadFiles()
  {
    let trip: Trip = this.created_trip;

    let folder: string = "trips/"+trip.id;
    //console.log("folder ", folder);
    
    this.files.forEach( (element, index) => {
      //console.log("index ", index);
      //console.log("element ", element);
      let file = element;
      let fileName = file.name;
      var extension =  fileName.split('.').pop();
      let new_file_name = ((new Date()).getTime())+"-"+(Math.random().toString()).split('.').pop();
      //let path = folder+"/"+index+"."+extension;
      let path = folder+"/"+new_file_name+"."+extension;
      //console.log("path ", path);

      let customFileToUpload: CustomFileToUpload = {
        'path': path,
        'file': file
      };
      this.filesToUpload.push(customFileToUpload);

    });

    return this.s3UploadService.uploadMultipleFiles(this.filesToUpload);
  }

  goToTripList() {
    this.router.navigate(['/trips/list']);
  }

}
