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

  async registerUser(actor: Actor) {
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
      const url = `${environment.backendApiBaseURL + '/actors'}`;
      const body = JSON.stringify(actor);

      this.http.post<any>(url, body, httpOptions).subscribe({
        next: (_) => {window.alert('Registro Realizado Correctamente!')},
        error: (error_1) => {
          console.error('There was an error!', error_1);
        },
      });
    } catch (error_2) {
      window.alert(error_2);
      //!Esta devolviendo errores de que el email ya está cogido.. se debería solucionar una vez se implemente el login.
    }
  }


getRoles(): string[] {
  return ['EXPLORER', 'MANAGER', 'ADMINISTRATOR'];
}

//?Login y Logout preparados
//L01-S03. Getting Started (III) - theory.pdf: página 95
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
