import { Injectable } from '@angular/core';
import { Actor } from '../models/actor.model';

import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';
import { User as FirebaseUser } from "firebase/auth";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //?Para un futuro, nos tendremos que encargar de que el usuario que esté metido, esté en el LocalStorage
  //?user: any;
  //?auth: Subject<any> = new Subject<any>();

  //para controlar el login y el logout
  firebase_user_is_logged_in: boolean = false;

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) 
  {
    //? const actor: any = localStorage.getItem('user');
    //? this.user =
    //?   localStorage.getItem('user') !== null ? JSON.parse(actor) : null;
    //? this.auth.next(this.user);

    //para controlar el login y el logout
    this.afAuth.onAuthStateChanged((user) => {

      if (user) 
      {
        this.firebase_user_is_logged_in = true;
      } 
      else
      {
        this.firebase_user_is_logged_in = false;
        user = null;
      }
      console.log("AuthService constructor onAuthStateChanged this.firebase_user_is_logged_in", this.firebase_user_is_logged_in);
      
      localStorage.setItem('user', JSON.stringify(user));

    });

  }

  //para controlar el login y el logout
  public isLoggedIn(): boolean 
  {
    return this.firebase_user_is_logged_in;
  }

  async registerUser(actor: Actor) {

    //? localStorage.removeItem('token');
    //? localStorage.removeItem('user');
    //? this.user = null;
    
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(
        actor.email,
        actor.password
      )
      .then((response1) => {

        console.log('AuthService->registerUser->createUserWithEmailAndPassword then response', response1);

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        const url = `${environment.backendApiBaseURL + '/actors'}`;
        const body = JSON.stringify(actor);

        this.http.post<any>(url, body, httpOptions).subscribe({
          next: (response2) => {

            console.log('AuthService->registerUser post next response', response2);
            console.log('Registro Realizado Correctamente!');

            resolve(response2);

          },
          error: (error2) => {

            console.error('AuthService->registerUser post error', error2);
            reject(error2);
          }
        });

      })
      .catch((error1) => {

        console.error('AuthService->registerUser->createUserWithEmailAndPassword catch error', error1);
        reject(error1);

      });
    });

  }

  getRoles(): string[] {
    return ['EXPLORER', 'MANAGER', 'ADMINISTRATOR'];
  }

  login(email: string, password: string) {

    console.log(email + " - " + password);

    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(response => {

          console.log("AuthService->login: then response ", response);
          resolve(response.user);

        }).catch(err => {

          console.log("AuthService->login: catch err", err);
          reject(err);

        });
    });

  }

  logout() {

    let isLoggedIn: boolean = this.isLoggedIn();
    console.log("AuthService->logout isLoggedIn ", isLoggedIn);

    return new Promise<any>((resolve, reject) => {
      this.afAuth.signOut()
      .then(response => {

        console.log("AuthService->logout: then response ", response);
        resolve(response);

      }).catch(err => {

        console.log("AuthService->logout: catch err", err);
        reject(err);

      });
    });

  }

}
