import { Injectable } from '@angular/core';
import { Actor } from '../models/actor.model';

import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';
import { User as FirebaseUser } from "firebase/auth";
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Accept-Language': 'es'
  }),
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
  private currentActor!: Actor | null;
  private loginStatus = new Subject<Boolean>();

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {

    //para controlar el login y el logout
    this.afAuth.onAuthStateChanged((user) => {

      if (user) {
        this.firebase_user_is_logged_in = true;
      }
      else {
        this.firebase_user_is_logged_in = false;
        user = null;
      }
      console.log("AuthService constructor onAuthStateChanged this.firebase_user_is_logged_in", this.firebase_user_is_logged_in);

      localStorage.setItem('loggedIn', JSON.stringify(this.firebase_user_is_logged_in));
      localStorage.setItem('firebase_user', JSON.stringify(user));

    });

  }

  //para controlar el login y el logout
  public isLoggedIn(): boolean {
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
    return ['EXPLORER', 'MANAGER', 'ADMINISTRATOR', 'SPONSOR'];
  }

  login(email: string, password: string) {

    console.log(email + " - " + password);
    const url = environment.backendApiBaseURL + '/login?email=' + email + '&password='+password;

    return new Promise<any>((resolve, reject) => {
      this.http.get<Actor[]>(url, httpOptions).subscribe({
        next: (response1: any) => {

          console.log('AuthService->login get next response1', response1);
          this.currentActor = response1;
          let customToken = response1.customToken;

          this.afAuth.signInWithCustomToken(customToken)
          .then((response2) => {

            let userCredential = response2;

            // Signed in
            let user = userCredential.user;
            console.log('afAuth->signInWithCustomToken then userCredential', userCredential);
            console.log('afAuth->signInWithCustomToken then user?.getIdToken()', );

            user?.getIdToken()
            .then((response3) => {
              let idToken = response3;
              console.log('user->getIdToken then idToken', idToken);

              localStorage.setItem('currentActor', JSON.stringify(this.currentActor));
              localStorage.setItem('idToken', idToken);
              this.loginStatus.next(true);

            })
            .catch((error3) => {
              //let errorCode = error3.code;
              //let errorMessage = error3.message;
              console.error('user->getIdToken catch error3', error3);
            });

          })
          .catch((error2) => {
            //let errorCode = error2.code;
            //let errorMessage = error2.message;
            console.error('afAuth->signInWithCustomToken catch error2', error2);
          });
          //resolve(response);

        },
        error: (error1: any) => {

          console.error('AuthService->login get error1', error1);
          //reject(error1);
        }
      });
    });

    /*
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(async response => {
          const url = environment.backendApiBaseURL + '/actors?email=' + email;
          const actor = await firstValueFrom(this.http.get<Actor[]>(url));
          this.currentActor = actor[0];
          localStorage.setItem('currentActor', JSON.stringify(this.currentActor));
          this.loginStatus.next(true);
          console.log("AuthService->login: then response ", response);
          resolve(response.user);

        }).catch(err => {

          console.log("AuthService->login: catch err", err);
          reject(err);

        });
    });
    */
  }

  getCurrentActor(): Actor | null {
    let loggedIn_stored = localStorage.getItem('loggedIn');
    let loggedIn: boolean;
    let user: Actor | null = null;
    console.log("HeaderComponent->ngAfterViewChecked user_stored", loggedIn_stored);

    if (loggedIn_stored != null) {
      loggedIn = JSON.parse(loggedIn_stored);
      if (loggedIn) {
        let user_stored = localStorage.getItem('currentActor');
        user = JSON.parse(user_stored!);
      }
    }

    return user;

    /*if (this.currentActor) {
      return this.currentActor;
    } else {
      return null;
    }*/

  }

  logout() {

    let isLoggedIn: boolean = this.isLoggedIn();
    console.log("AuthService->logout isLoggedIn ", isLoggedIn);

    return new Promise<any>((resolve, reject) => {
      this.afAuth.signOut()
        .then(response => {
          console.log("AuthService->logout loginStatus ", this.loginStatus);
          this.loginStatus.next(false);
          this.currentActor = null;
          localStorage.setItem('currentActor', JSON.stringify(this.currentActor));
          console.log("AuthService->logout: then response ", response);
          resolve(response);


        }).catch(err => {

          console.log("AuthService->logout: catch err", err);
          reject(err);

        });
    });
  }

  getStatus(): Observable<Boolean> {
    let loggedIn_stored = localStorage.getItem('loggedIn');
    let loggedIn: boolean = false;
    if (loggedIn_stored != null) {
      loggedIn = JSON.parse(loggedIn_stored);
      //console.log("AuthService->loggedIn:", loggedIn);
    }
    this.loginStatus.next(loggedIn);

    return this.loginStatus.asObservable();
  }

}
