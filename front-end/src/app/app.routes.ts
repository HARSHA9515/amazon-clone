import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { AdminDahboardComponent } from '../admin/admin-dahboard/admin-dahboard.component';
import { UserDashboardComponent } from '../user/user-dashboard/user-dashboard.component';
import { AdminProductsComponent } from '../admin/admin-products/admin-products.component';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'admin-dashboard',
    component:AdminDahboardComponent,
    children:[
      {
        path: 'admin-products',
        component: AdminProductsComponent
      }
    ]
  },
  { path: 'user-dashboard', component:UserDashboardComponent}
];
