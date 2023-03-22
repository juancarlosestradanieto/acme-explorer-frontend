import { Injectable } from '@angular/core';
import { Actor } from '../models/actor.model';
//import { AngularFireAuth } from '@angular/fire/compat/auth';

import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
  ) {
    //? const actor: any = localStorage.getItem('user');
    //? this.user =
    //?   localStorage.getItem('user') !== null ? JSON.parse(actor) : null;
    //? this.auth.next(this.user);
  }

  /*async registerUser(actor: Actor) {
    //? localStorage.removeItem('token');
    //? localStorage.removeItem('user');
    //? this.user = null;
    try {
      await this.afAuth.createUserWithEmailAndPassword(
        actor.email,
        actor.password
      );
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      console.log("environment.backendApiBaseURL "+environment.backendApiBaseURL);
      const url = `${environment.backendApiBaseURL + '/actors'}`;
      const body = JSON.stringify(actor);

      this.http.post<any>(url, body, httpOptions).subscribe({
        next: (_) => {
          window.alert('Registro Realizado Correctamente!');
          console.log("Prueba" , _);
          //return _;
       },
        error: (error_1) => {
          console.error('There was an error!', error_1);
        },
      });
    } catch (error_2) {
      window.alert(error_2);
      //!Esta devolviendo errores de que el email ya está cogido.. se debería solucionar una vez se implemente el login.
    }
  }*/

  getUsers(): Promise<Actor[]> {
    return new Promise<any>((resolve, reject) => {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      const url = `${environment.backendApiBaseURL + '/actors'}`;
      this.http.get(url, httpOptions).toPromise().then(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    });
  }

  registerUser(actor: Actor): Promise<Actor>{
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(actor.email, actor.password)
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
          if (err.code == "auth/email-already-in-use") {
            alert("The email address is already in use");
          } else if (err.code == "auth/invalid-email") {
            alert("The email address is not valid.");
          } else if (err.code == "auth/operation-not-allowed") {
            alert("Operation not allowed.");
          } else if (err.code == "auth/weak-password") {
            alert("The password is too weak.");
          }
          reject(err);
        });
    });
  }

  getRoles(): string[] {
    return ['EXPLORER', 'MANAGER', 'ADMINISTRATOR'];
  }

  //?Login y Logout preparados
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
