import { Routes } from '@angular/router';
import { IncidentManagementComponent } from './pages/incident-management/incident-management.component';
import { IncidentListComponent } from './pages/incident-management/incident-list/incident-list.component';
import { IncidentDetailComponent } from './pages/incident-management/incident-detail/incident-detail.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminLandingComponent } from './pages/admin/admin-landing/admin-landing.component';
import { ModuleDetailComponent } from './pages/admin/module-detail/module-detail.component';
import { UsersDetailComponent } from './pages/admin/users-detail/users-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'incident-management', pathMatch: 'full' },
  {
    path: 'incident-management',
    component: IncidentManagementComponent,
    children: [
      { path: '', component: IncidentListComponent },
      { path: ':id', component: IncidentDetailComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: AdminLandingComponent },
      { path: 'module/:moduleId', component: ModuleDetailComponent },
      { path: 'users', component: UsersDetailComponent }
    ]
  }
];
