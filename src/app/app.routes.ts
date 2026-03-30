import { Routes } from '@angular/router';
import { IncidentManagementComponent } from './pages/incident-management/incident-management.component';
import { IncidentListComponent } from './pages/incident-management/incident-list/incident-list.component';
import { IncidentDetailComponent } from './pages/incident-management/incident-detail/incident-detail.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminLandingComponent } from './pages/admin/admin-landing/admin-landing.component';
import { ModuleDetailComponent } from './pages/admin/module-detail/module-detail.component';
import { UsersDetailComponent } from './pages/admin/users-detail/users-detail.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, loginRedirectGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginRedirectGuard]
  },
  {
    path: 'incident-management',
    component: IncidentManagementComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: IncidentListComponent },
      { path: ':id', component: IncidentDetailComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: AdminLandingComponent },
      { path: 'module/:moduleId', component: ModuleDetailComponent },
      { path: 'users', component: UsersDetailComponent }
    ]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loginRedirectGuard]
  }
];
