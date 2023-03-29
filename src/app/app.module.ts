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
    SingleTripComponent
    ApplicationslistComponent,
    ApplicationdisplayComponent,
    AccessdeniedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
