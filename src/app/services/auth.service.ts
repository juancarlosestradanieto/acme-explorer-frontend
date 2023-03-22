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

  //pruebas para verificar que hace el logout
  firebase_user_is_logged_in: boolean = false;
  firebase_user_logged_in: any = null;

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) 
  {
    //? const actor: any = localStorage.getItem('user');
    //? this.user =
    //?   localStorage.getItem('user') !== null ? JSON.parse(actor) : null;
    //? this.auth.next(this.user);

    //para verificar el login y el logout
    this.afAuth.onAuthStateChanged((user) => {

      if (user) 
      {
        this.firebase_user_is_logged_in = true;
        this.firebase_user_logged_in = user;
      } 
      else
      {
        this.firebase_user_is_logged_in = false;
        this.firebase_user_logged_in = null;
      }
      console.log("onAuthStateChanged this.firebase_user_is_logged_in", this.firebase_user_is_logged_in);
      console.log("onAuthStateChanged this.firebase_user_logged_in", this.firebase_user_logged_in);

    });

  }

  //para verificar el login y el logout
  public isLoggedIn(): boolean 
  {
    return this.firebase_user_is_logged_in;
  }

  async registerUser(actor: Actor) {
    //? localStorage.removeItem('token');
    //? localStorage.removeItem('user');
    //? this.user = null;
    
    try 
    {

      await this.afAuth.createUserWithEmailAndPassword(
        actor.email,
        actor.password
      );

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      const url = `${environment.backendApiBaseURL + '/actors'}`;
      const body = JSON.stringify(actor);

      this.http.post<any>(url, body, httpOptions).subscribe({
        next: (response) => {
          console.log('AuthService->registerUser next response', response);
          console.log('Registro Realizado Correctamente!');
        },
        error: (error_1) => {
          console.error('AuthService->registerUser error', error_1);
        },
      });

    } 
    catch (error_2) 
    {
      console.error('AuthService->registerUser catch', error_2);
    }
  }

  getRoles(): string[] {
    return ['EXPLORER', 'MANAGER', 'ADMINISTRATOR'];
  }

  login(email: string, password: string) {

    //console.log(email + " - " + password);

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
