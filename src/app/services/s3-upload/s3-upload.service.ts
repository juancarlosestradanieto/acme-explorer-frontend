import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { CustomFileToUpload } from 'src/app/components/pages/trips/add-trip/add-trip.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class S3UploadService {

  s3 = new S3({
    accessKeyId: environment.s3.accessKeyId,
    secretAccessKey: environment.s3.secretAccessKey,
    region: environment.s3.region
  });

  params: S3.Types.PutObjectRequest = {
    Bucket: environment.s3.bucket,
    ACL: 'public-read',
    Key: '',
    Body: '',
    ContentType: ''
  };

  constructor() { }

  uploadSingleFile(fileToUpload: CustomFileToUpload) 
  {
    let path = fileToUpload.path;
    let file = fileToUpload.file;

    this.params.Key = path;
    this.params.Body = file;
    this.params.ContentType = file.type;

    //for upload
    /*
    s3.upload(params, function (err: Error, data: S3.ManagedUpload.SendData) {

      if (err) 
      {
        console.log('There was an error uploading your file: ', err);
        return false;
      }

      console.log('Successfully uploaded file.', data);

      return true;
    });
    */
    
    //for upload showing progress   
    this.s3.upload(this.params).on('httpUploadProgress', function (evt) {

      console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      
    })
    .send(function (error: Error, data: S3.ManagedUpload.SendData) {

      if(error) 
      {
        console.log('There was an error uploading your file: ', error);
        return false;
      }
      else
      {
        console.log('Successfully uploaded file.', data);
        return true;
      }
  
    });

  }

  uploadMultipleFiles(filesToUpload: Array<CustomFileToUpload>)
  {
    let amount_of_files = filesToUpload.length;
    let amount_of_files_successfully_uploaded = 0;
    let responses: Array<any> = [];

    return new Promise<any>(async (resolve, reject) => {

      await filesToUpload.forEach( async (fileToUpload) => {
        
        let path = fileToUpload.path;
        let file = fileToUpload.file;
    
        this.params.Key = path;
        this.params.Body = file;
        this.params.ContentType = file.type;
        let response = null;
    
        try 
        {
          response = await this.s3.upload(this.params).promise();
          console.log("S3UploadService -> uploadMultipleFiles -> response ", response);
          responses.push(response);
          
          amount_of_files_successfully_uploaded++;

          console.log("S3UploadService -> uploadMultipleFiles -> try amount_of_files_successfully_uploaded ", amount_of_files_successfully_uploaded);
          
          if(amount_of_files_successfully_uploaded == amount_of_files)
          {
            resolve({
              status: 200,
              message: "All files uploaded successfully.",
              responses: responses
            });
          }
        } 
        catch(error) 
        {
          console.error("S3UploadService -> uploadMultipleFiles -> error ", error);
          reject(error);
        }

      });

    });

  }

}
