import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsandconditionsComponent } from './components/master/termsandconditions/termsandconditions.component';
import { ActorProfileComponent } from './components/pages/actor-profile/actor-profile.component';
import { CustomizeUiComponent } from './components/pages/customize-ui/customize-ui.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { FavoriteTripsComponent } from './components/pages/favorite-trips/favorite-trips.component';
import { FindersComponent } from './components/pages/finders/finders.component';
import { SponsorshipComponent } from './components/pages/sponsorship/sponsorship.component';
import { TripApplicationsComponent } from './components/pages/trip-applications/trip-applications.component';
import { TripSponsorshipsComponent } from './components/pages/trip-sponsorships/trip-sponsorships.component';
import { AllTripsComponent } from './components/pages/trips/all-trips/all-trips.component';
import { LoginComponent } from './components/security/login/login.component';
import { RegisterComponent } from './components/security/register/register.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';

const routes: Routes = [
  {
    path:'register', component: RegisterComponent
  },
  {
    path:'login', component: LoginComponent
  },
  {
    path:'trip-list', component: AllTripsComponent
  },
  {
    path:'termsandconditions', component: TermsandconditionsComponent
  },
  {
    path: 'actor/:id', children: [
      {
        path:'profile', component: ActorProfileComponent
      },
      {
        path:'customize-ui', component: CustomizeUiComponent
      },
      {
        path:'favorite_trips', component: FavoriteTripsComponent
      },
      {
        path:'finder', component: FindersComponent
      },
      {
        path:'sponsorships', component: SponsorshipComponent
      },
    ]
  },
  {
    path: 'trip/:id', children: [
      {
        path:'applications', component: TripApplicationsComponent
      },
      {
        path:'sponsorships', component: TripSponsorshipsComponent
      },
    ]
  },
  {
    path:'dashboard', component: DashboardComponent
  },
  {
    path:'', redirectTo: '/trip-list', pathMatch: 'full'
  },
  {
    path:'**', component: NotFoundComponent
  }
];

/**
 * perfil
 * application
 * finders
 * dashboard
 * customize_ui
 * sponsorship
 * favorite_trips
 */

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
