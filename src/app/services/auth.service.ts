import { Injectable } from '@angular/core';
import { Actor } from '../models/actor.model';
//import { AngularFireAuth } from '@angular/fire/compat/auth';

import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {


  constructor(
    //private fireAuth: AngularFireAuth,
    private http: HttpClient
  ) { }

  registerUser(actor: Actor) {
    return new Promise<any>((resolve, reject) => {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      const url = `${environment.backendApiBaseURL + '/actors'}`;
      console.log(actor);
      const body = JSON.stringify(actor);
      console.log(body);
      this.http.post(url, body, httpOptions).toPromise()
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  /*
      return new Promise<any>((resolve, reject) => {
        this.fireAuth.auth.createUserWithEmailAndPassword(actor.email, actor.password)
          .then(_ => {
            const headers = new HttpHeaders();
            headers.append('Content-Type', 'application/json');
            const url = `${environment.backendApiBaseURL + '/actors'}`;
            const body = JSON.stringify(actor);
            this.http.post(url, body, httpOptions).toPromise()
              .then(res => {
                resolve(res);
              }, err => {
                reject(err);
              });
          }).catch(err => {
            reject(err);
          });
      });
      */
}

getRoles(): string[] {
  return ['EXPLORER', 'MANAGER', 'ADMINISTRATOR'];
}

login(email: string, password: string) {
  console.log(email + " - " + password);
  /*return new Promise<any>((resolve, reject) => {
    this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(_ => {
        resolve();
      }).catch(err => {
        reject(err);
      });
  });*/
}

logout() {
  console.log("logged out");
  /*return new Promise<any>((resolve, reject) => {
    this.fireAuth.auth.signOut()
    .then(_ => {
      resolve();
    }).catch(err => {
      reject(err);
    });
  });*/
}

}
