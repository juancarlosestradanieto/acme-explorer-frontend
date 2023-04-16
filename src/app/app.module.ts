import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './components/security/register/register.component';
import { LoginComponent } from './components/security/login/login.component';

//Firebase
import { AngularFireModule} from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { HeaderComponent } from './components/master/header/header.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { AllTripsComponent } from './components/pages/trips/all-trips/all-trips.component';
import { LangSwitchComponent } from './components/shared/lang-switch/lang-switch.component';
import { FooterComponent } from './components/master/footer/footer.component';
import { TermsandconditionsComponent } from './components/master/termsandconditions/termsandconditions.component';

//Traduccion
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';
import { ActorProfileComponent } from './components/pages/actor-profile/actor-profile.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { CustomizeUiComponent } from './components/pages/customize-ui/customize-ui.component';
import { SponsorshipComponent } from './components/pages/sponsorship/sponsorship.component';
import { FavoriteTripsComponent } from './components/pages/favorite-trips/favorite-trips.component';
import { FindersComponent } from './components/pages/finders/finders.component';
import { TripSponsorshipsComponent } from './components/pages/trip-sponsorships/trip-sponsorships.component';
import { TripApplicationsComponent } from './components/pages/trip-applications/trip-applications.component';
import { SingleTripComponent } from './components/pages/trips/single-trip/single-trip.component';
import { ApplicationslistComponent } from './components/pages/applications/applicationslist/applicationslist.component';
import { ApplicationdisplayComponent } from './components/pages/applications/applicationdisplay/applicationdisplay.component';
import { AccessdeniedComponent } from './components/shared/denied-access/accessdenied/accessdenied.component';
import { ThemeToggleComponent } from './components/shared/theme-toggle/theme-toggle.component';
import { ApplicationcreationComponent } from './components/pages/applications/applicationcreation/applicationcreation.component';
import { AddTripComponent } from './components/pages/trips/add-trip/add-trip.component';
import { EditTripComponent } from './components/pages/trips/edit-trip/edit-trip.component';
import { AllActorsComponent } from './components/pages/actors/all-actors/all-actors.component';
import { AddActorComponent } from './components/pages/actors/add-actor/add-actor.component';
import { EditActorComponent } from './components/pages/actors/edit-actor/edit-actor.component';
import { RegisterManagerComponent } from './components/pages/actors/register-manager/register-manager.component';


//Angular Material Modules
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

 let ANGULAR_MATERIAL_MODULES =[
  MatPaginatorModule,
  MatDialogModule,
  BrowserAnimationsModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule
 ]

 //Traducción
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    NotFoundComponent,
    AllTripsComponent,
    FooterComponent,
    TermsandconditionsComponent,
    LangSwitchComponent,
    ActorProfileComponent,
    DashboardComponent,
    CustomizeUiComponent,
    SponsorshipComponent,
    FavoriteTripsComponent,
    FindersComponent,
    TripSponsorshipsComponent,
    TripApplicationsComponent,
    SingleTripComponent,
    ApplicationslistComponent,
    ApplicationdisplayComponent,
    AccessdeniedComponent,
    ThemeToggleComponent,
    ApplicationcreationComponent,
    AddTripComponent,
    EditTripComponent,
    AllActorsComponent,
    AddActorComponent,
    EditActorComponent,
    RegisterManagerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...ANGULAR_MATERIAL_MODULES,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
