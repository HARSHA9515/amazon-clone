import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { AdminDashboardComponent } from '../admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from '../user/user-dashboard/user-dashboard.component';
export const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin-dashboard',
    component:AdminDashboardComponent
  }
];
