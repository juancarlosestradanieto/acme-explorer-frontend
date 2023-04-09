import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripPicture } from 'src/app/models/trip-picture.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { S3UploadService } from 'src/app/services/s3-upload/s3-upload.service';
import { TripsService } from 'src/app/services/trips/trips.service';
import { environment } from 'src/environments/environment';

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
  production: boolean = environment.production;
  files: Array<File> = [];
  filesToUpload: Array<CustomFileToUpload> = [];
  created_trip!: Trip;

  default_string_value = '';
  default_date_value = '';
  default_number_value = 0;

  editing_trip_id!: string;
  edit_mode = false;
  title = 'Add new trip';
  editing_trip!: Trip;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private tripService: TripsService,
    private router: Router,
    private s3UploadService: S3UploadService,
    private route:ActivatedRoute
  )
  { 
    this.editing_trip_id = this.route.snapshot.params['id'];
    //console.log("this.editing_trip_id ", this.editing_trip_id);
    if(typeof this.editing_trip_id !== 'undefined' && this.editing_trip_id !== '')
    {
      this.edit_mode = true;
      this.title = 'Edit trip';
    }

    //default values for development and create mode
    if(this.production == false && this.edit_mode == false)
    {
      this.default_string_value = 'test';
      this.default_date_value = (new Date()).toLocaleDateString('en-CA');//YYY-mm-dd
      this.default_number_value = 125;
    }

    this.tripForm = this.createForm();

    if(this.edit_mode == true)
    {
      this.modifyFormOnEdit();
    }
  }

  ngOnInit(): void {
  }

  createForm()
  {
    let currectActor = this.authService.getCurrentActor();
    //console.log("currectActor ", currectActor);

    return this.fb.group({
      title: [ this.default_string_value , Validators.required],
      description: [ this.default_string_value , Validators.required],
      price: [ this.default_number_value , [Validators.required, Validators.min(1), Validators.max(999999)]],
      requirements: this.fb.array([
        //uncomment next line to initialize with one element
        this.getRequirement()
      ]),
      startDate: [ this.default_date_value , Validators.required],
      endDate: [ this.default_date_value , Validators.required],
      publicationDate: [''],
      pictures: this.fb.array([
        //uncomment next line to initialize with one element
        //this.getPicture()
      ]),
      stages: this.fb.array([
        //uncomment next line to initialize with one element
        this.getStage()
      ]),
      managerId: [currectActor?.id, Validators.required],
    });
  }

  modifyFormOnEdit()
  {
    this.tripService.getSingleTrip(this.editing_trip_id)
    .then((response) => {

      console.log("AddTripComponent->modifyFormOnEdit tripsService.getSingleTrip then response ", response);
      let json_trip = response;
      let casted_trip: Trip = Trip.castJsonTrip(json_trip);
      this.editing_trip = casted_trip;

      //prepare values

      //startDate
      let startDate: string = (new Date(casted_trip.getStartDate())).toLocaleDateString('en-CA');
      //console.log("startDate ", startDate);
      //endDate
      let endDate: string = (new Date(casted_trip.getEndDate())).toLocaleDateString('en-CA');
      //console.log("endDate ", endDate);
      //publicationDate
      let publicationDate: string = casted_trip.getPublicationDate() != null ? (new Date(casted_trip.getPublicationDate())).toLocaleDateString('en-CA') : '';
      //console.log("publicationDate ", publicationDate);

      //requirements
      let original_requirements = casted_trip.getRequirements();

      for(let i = 0; i < (original_requirements.length - 1); i++)
      {
        this.onAddRequirement();
      }

      var formatted_requirements = Object.keys(original_requirements!)
      .map((key: any) => { 
        return {'requirement': original_requirements[key]};
      });
      //console.log("formatted_requirements ", formatted_requirements);

      //pictures
      //var formatted_pictures = [{'picture': ''}];
      var formatted_pictures: Array<any> = [];

      //stages
      let original_stages = casted_trip.getStages();
      let formated_stages = original_stages.map((stage) => {
        return {
          title: stage.getTitle(),
          description: stage.getDescription(),
          price: stage.getPrice()
        }
      });

      this.tripForm.setValue({
        title: casted_trip.getTitle(),
        description: casted_trip.getDescription(),
        price: casted_trip.getPrice(),
        requirements: formatted_requirements,
        startDate: startDate,
        endDate: endDate,
        publicationDate: publicationDate,
        pictures: formatted_pictures,
        stages: formated_stages,
        managerId: casted_trip.getManagerId()
      });

    })
    .catch((error) => {

      console.error("AddTripComponent->modifyFormOnEdit tripsService.getSingleTrip catch ", error);

    });
  }

  private getRequirement()
  {
    return this.fb.group({
      requirement: [ this.default_string_value , Validators.required],
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
    return this.fb.group({
      title: [ this.default_string_value , Validators.required],
      description: [ this.default_string_value , Validators.required],
      price: [ this.default_number_value , [Validators.required, Validators.min(1), Validators.max(999999)]],
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
        let image_element = document.getElementById("picture-previsualization-"+i);
        let src = reader.result as string;
        image_element?.setAttribute("src", src);
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
    console.log("newFormaData ", newFormaData);

    /*

    let publicationDateBackup = formData.publicationDate;

    let stored_pictures_backup: Array<any> = []; 
    
    let promise = null;
    if(this.edit_mode == false)
    {
      newFormaData["publicationDate"] = null;
      promise = this.tripService.createTrip(newFormaData);
    }
    else
    {
      this.editing_trip.setDescription(newFormaData["description"]);
      this.editing_trip.setTitle(newFormaData["title"]);
      this.editing_trip.setPrice(newFormaData["price"]);
      this.editing_trip.setStartDate(newFormaData["startDate"]);
      this.editing_trip.setEndDate(newFormaData["endDate"]);
      this.editing_trip.setPublicationDate(newFormaData["publicationDate"]);
      this.editing_trip.setRequirements(newFormaData["requirements"]);
      this.editing_trip.setStages(newFormaData["stages"]);

      console.log("newFormaData.id", newFormaData.id);
      stored_pictures_backup = this.editing_trip.getPictures().map((picture) => {
        return {'picture': picture.getPicture()};
      });
      console.log("stored_pictures_backup", stored_pictures_backup);
      console.log("newFormaData['pictures']", newFormaData['pictures']);
      
      promise = this.tripService.updateTrip(this.editing_trip);
    }
    
    promise.then((response1) => {

      console.log("AddTripComponent->onSubmit then response1 ", response1);

      this.created_trip = new Trip(response1);
      console.log("this.created_trip ", this.created_trip);

      this.uploadFiles()    
      .then((response2) => {

        console.log("AddTripComponent->onSubmit->uploadFiles then response ", response2);
        let responses = response2.responses;

        let pictures: Array<any> = [];

        if(this.edit_mode == true)
        {
          pictures = stored_pictures_backup;
        }

        responses.forEach((response: any) => {
          pictures.push({picture: response.Location});
        });

        console.log("pictures ", pictures);
        this.created_trip.setPictures(pictures);
        this.created_trip.setPublicationDate(new Date(publicationDateBackup!));
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

    */
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

  onRemovePreviouslySelectedPicture(picture: TripPicture)
  {

    if(confirm("Are you sure to delete?, this action can't be undone.")) {

      let url = picture.getPicture();
      console.log("url ", url);
      let path: string = url.split("amazonaws.com/").pop()!;
      console.log("path ", path);

      this.s3UploadService.deleteFile(path)
      .then((response1) => {

        console.log("AddTripComponent->onRemovePreviouslySelectedPicture response1 ", response1);

        let pictures = this.editing_trip.getPictures();
        const index = pictures.indexOf(picture);
        if (index > -1) { // only splice array when item is found
          pictures.splice(index, 1); // 2nd parameter means remove one item only
        }
        this.editing_trip.setPictures(pictures);
        console.log("this.editing_trip", this.editing_trip);
        

        this.tripService.updateTrip(this.editing_trip)
        .then((response2) => {

          console.log("AddTripComponent->onRemovePreviouslySelectedPicture updateTrip response2 ", response2);
          
        })
        .catch((error2) => {

          console.error("AddTripComponent->onRemovePreviouslySelectedPicture updateTrip error2 ", error2);
    
        });

      })
      .catch((error1) => {
  
        console.error("AddTripComponent->onRemovePreviouslySelectedPicture error1 ", error1);
  
      });

    }
  }

}
