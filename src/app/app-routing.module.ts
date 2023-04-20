import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsandconditionsComponent } from './components/master/termsandconditions/termsandconditions.component';
import { ActorProfileComponent } from './components/pages/actor-profile/actor-profile.component';
import { ApplicationdisplayComponent } from './components/pages/applications/applicationdisplay/applicationdisplay.component';
import { ApplicationslistComponent } from './components/pages/applications/applicationslist/applicationslist.component';
import { CustomizeUiComponent } from './components/pages/customize-ui/customize-ui.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { FavoriteTripsComponent } from './components/pages/favorite-trips/favorite-trips.component';
import { FindersComponent } from './components/pages/finders/finders.component';
import { SponsorshipComponent } from './components/pages/sponsorship/sponsorship.component';
import { TripApplicationsComponent } from './components/pages/trip-applications/trip-applications.component';
import { TripSponsorshipsComponent } from './components/pages/trip-sponsorships/trip-sponsorships.component';
import { AllTripsComponent } from './components/pages/trips/all-trips/all-trips.component';
import { SingleTripComponent } from './components/pages/trips/single-trip/single-trip.component';
import { LoginComponent } from './components/security/login/login.component';
import { RegisterComponent } from './components/security/register/register.component';
import { AccessdeniedComponent } from './components/shared/denied-access/accessdenied/accessdenied.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { ActorRoleGuard } from './guards/actor-role.guard';
import { ApplicationcreationComponent } from './components/pages/applications/applicationcreation/applicationcreation.component';
import { AddTripComponent } from './components/pages/trips/add-trip/add-trip.component';
import { EditTripComponent } from './components/pages/trips/edit-trip/edit-trip.component';
import { ManagerApplicationsGuard } from './guards/manager-applications.guard';
import { AllActorsComponent } from './components/pages/actors/all-actors/all-actors.component';
import { RegisterManagerComponent } from './components/pages/actors/register-manager/register-manager.component';
import { ActorProfileEditComponent } from './components/pages/actor-profile/actor-profile-edit/actor-profile-edit.component';

const routes: Routes = [
  {
    path: 'register', component: RegisterComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous' }
  },
  {
    path: 'login', component: LoginComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'anonymous' }
  },
  /*{
    path: 'trip-list', component: AllTripsComponent
  },*/
  {
    path: 'termsandconditions', component: TermsandconditionsComponent
  },
  {
    path: 'actor/:id', children: [
      {
        path: 'profile', component: ActorProfileComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'EXPLORER|MANAGER|ADMINISTRATOR|SPONSOR' }
      },
      {
        path: 'profile-edit', component: ActorProfileEditComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'EXPLORER|MANAGER|ADMINISTRATOR|SPONSOR' }
      },
      {
        path: 'customize-ui', component: CustomizeUiComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'EXPLORER' }
      },
      {
        path: 'favorite_trips', component: FavoriteTripsComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'EXPLORER' }
      },
      {
        path: 'finder', component: FindersComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'EXPLORER' }
      },
      {
        path: 'sponsorships', component: SponsorshipComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'SPONSOR' }
      },
    ]
  },
  /*
  {
    path: 'trip/:id', children: [
      {
        path: 'applications/new', component: ApplicationcreationComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'EXPLORER' }
      },
      {
        path: 'applications', component: ApplicationslistComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'MANAGER' }
      },
      {
        path: 'sponsorships', component: TripSponsorshipsComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'MANAGER' }
      },
      {
        path: '', component: SingleTripComponent
      }
    ]
  },
  */
  {
    path: 'trips', children: [
      {
        path: 'list', component: AllTripsComponent
      },
      {
        path: 'add', component: AddTripComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'MANAGER|ADMINISTRATOR' }
      },
      {
        path: ':id', children: [
          {
            path: 'edit', component: AddTripComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'MANAGER|ADMINISTRATOR' }
          },
          {
            path: 'applications/new', component: ApplicationcreationComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'EXPLORER' }
          },
          {
            path: 'applications', component: ApplicationslistComponent, canActivate: [ManagerApplicationsGuard]
          },
          {
            path: 'sponsorships', component: TripSponsorshipsComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'MANAGER' }
          },
          {
            path: '', component: SingleTripComponent
          }
        ]
      },
    ]
  },
  {
    path: 'applications', children: [
      {
        path: ':id', component: ApplicationdisplayComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'EXPLORER|MANAGER' }
      },
      {
        path: '', component: ApplicationslistComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'EXPLORER|MANAGER' }
      }
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [ActorRoleGuard], data: { expectedRole: 'ADMINISTRATOR' }
  },
  {
    path:'all-actors',component: AllActorsComponent, canActivate: [ActorRoleGuard], data:{ expectedRole: 'ADMINISTRATOR'}
  },
  {
    path:'register-manager',component: RegisterManagerComponent, canActivate: [ActorRoleGuard], data:{ expectedRole: 'ADMINISTRATOR'}
  },
  {
    path: 'denied-access', component: AccessdeniedComponent
  },
  {
    path: '', redirectTo: '/trips/list', pathMatch: 'full'
  },
  {
    path: '**', component: NotFoundComponent
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
