import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsandconditionsComponent } from './components/master/termsandconditions/termsandconditions.component';
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
    path:'', redirectTo: '/trip-list', pathMatch: 'full'
  },
  {
    path:'**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
