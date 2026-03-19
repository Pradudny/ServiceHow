import { Routes } from '@angular/router';
import { IncidentManagementComponent } from './pages/incident-management/incident-management.component';
import { IncidentListComponent } from './pages/incident-management/incident-list/incident-list.component';
import { IncidentDetailComponent } from './pages/incident-management/incident-detail/incident-detail.component';
import { AdminComponent } from './pages/admin/admin.component';

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
  { path: 'admin', component: AdminComponent }
];
