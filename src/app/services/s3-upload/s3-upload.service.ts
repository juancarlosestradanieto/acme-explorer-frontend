import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class S3UploadService {

  constructor() { }

  uploadFile(path: string, file: File) 
  {
    const contentType = file.type;
    const bucket = new S3({
      accessKeyId: environment.s3.accessKeyId,
      secretAccessKey: environment.s3.secretAccessKey,
      region: environment.s3.region
    });

    const params = {
      Bucket: environment.s3.bucket,
      Key: path,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };

    //for upload
    /*
    bucket.upload(params, function (err: Error, data: S3.ManagedUpload.SendData) {

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
    bucket.upload(params).on('httpUploadProgress', function (evt) {

      console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      
    })
    .send(function (err: Error, data: S3.ManagedUpload.SendData) {

      if (err) 
      {
        console.log('There was an error uploading your file: ', err);
        return false;
      }

      console.log('Successfully uploaded file.', data);
      
      return true;
  
    });

  }

}
