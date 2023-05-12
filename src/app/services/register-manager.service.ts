import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actor } from '../models/actor.model';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RegisterManagerService {

  firebase_user_is_logged_in: boolean = false;
  private currentActor!: Actor | null;
  private loginStatus = new Subject<Boolean>();

  constructor(private http: HttpClient, private afAuth2: AngularFireAuth) {
        //para controlar el login y el logout
        // this.afAuth2.onAuthStateChanged((user) => {

        //   if (user) {
        //     this.firebase_user_is_logged_in = true;
        //   }
        //   else {
        //     this.firebase_user_is_logged_in = false;
        //     user = null;
        //   }
        //   //console.log("AuthService constructor onAuthStateChanged this.firebase_user_is_logged_in", this.firebase_user_is_logged_in);
    
        //   localStorage.setItem('loggedIn', JSON.stringify(this.firebase_user_is_logged_in));
        //   localStorage.setItem('firebaseUser', JSON.stringify(user));
    
        // });
   }

  registerUserManager(actor:Actor){
    return new Promise<any>((resolve,reject)=>{
      this.afAuth2.createUserWithEmailAndPassword(actor.email,actor.password)
      .then((response)=>{
        console.log('registerManagerService->registerUserManager->createUserWithEmailAndPassword then response', response);
        const url = `${environment.backendApiBaseURL + '/actors2'}`;
        const body = JSON.stringify(actor);
        const idToken = localStorage.getItem('idToken') ?? '';
        //console.log("PANEL_ACTORES -> idToken del administrator actual: ",idToken)
          const httpOptions = {
          headers: new HttpHeaders({ 
            'Content-Type': 'application/json',
            'Accept-Language': 'es',
            'idToken': idToken 
          }),
          };
  
        this.http.post<any>(url,body,httpOptions).subscribe({
          next: (response2)=>{
  
            console.log('registerManagerService->registerUserManager-> post next response', response2);
            console.log('Registro Realizado Correctamente!');
            console.log('Firebase login automatically after creating an account, so it has to be logged out explicitly because it is not the desired behaviour');
            // this.logout();
            resolve(response2);  
  
          },
          error: (error2) => {
  
            console.error('registerManagerService->registerUserManager-> post error2', error2);
            console.log("The user created in firebase has to be deleted because the attemp to create it in backend failed");
  
            this.afAuth2.currentUser.then((user) => {
              user?.delete()
              .then((response3) => {
                
                console.log("registerManagerService->registerUserManager->->currentUser->delete then response3 ", response3);
                reject(error2);
          
              })
              .catch((error3) => {
          
                console.error("registerManagerService->registerUserManager->->currentUser->delete error3 ", error3);
                reject(error3);
          
              });
            });
  
          }
        });
  
      })
      .catch((error1) => {
          
        console.error('AuthService->registerUser->createUserWithEmailAndPassword catch error', error1);
        reject(error1);
  
      });
    })
  }

    //para controlar el login y el logout
    public isLoggedIn(): boolean {
      return this.firebase_user_is_logged_in;
    }
  
    
  // getCurrentActor(): Actor | null {

  //   let loggedIn_stored = localStorage.getItem('loggedIn');
  //   let loggedIn: boolean;
  //   let user: Actor | null = null;
  //   //console.log("HeaderComponent->ngAfterViewChecked user_stored", loggedIn_stored);

  //   if (loggedIn_stored != null) {
  //     loggedIn = JSON.parse(loggedIn_stored);
  //     if (loggedIn) {
  //       let user_stored = localStorage.getItem('currentActor');
  //       user = Actor.castJsonActor(JSON.parse(user_stored!));
  //     }
  //   }

  //   return user;

  // }

  // logout() {

  //   let isLoggedIn: boolean = this.isLoggedIn();
  //   console.log("AuthService->logout isLoggedIn ", isLoggedIn);

  //   return new Promise<any>((resolve, reject) => {
  //     this.afAuth2.signOut()
  //       .then(response => {

  //         console.log("AuthService->logout: then response ", response);
  //         console.log("AuthService->logout loginStatus ", this.loginStatus);

  //         this.loginStatus.next(false);
  //         this.currentActor = null;
  //         localStorage.setItem('currentActor', JSON.stringify(this.currentActor));
  //         localStorage.removeItem('idToken');

  //         resolve(response);

  //       }).catch(err => {

  //         console.log("AuthService->logout: catch err", err);
  //         reject(err);

  //       });
  //   });
  // }

  // getStatus(): Observable<Boolean> {
  //   let loggedIn_stored = localStorage.getItem('loggedIn');
  //   let loggedIn: boolean = false;
  //   if (loggedIn_stored != null) {
  //     loggedIn = JSON.parse(loggedIn_stored);
  //     //console.log("AuthService->loggedIn:", loggedIn);
  //   }
  //   this.loginStatus.next(loggedIn);

  //   return this.loginStatus.asObservable();
  // }

}
