import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './user/product/product.component';
import { CategoryPageComponent } from './user/category-page/category-page.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user/home/home.component';
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
  },
  {
    path: 'product/:id',
    component: ProductComponent
  },
  {
    path: 'category/:id',
    component: CategoryPageComponent
  }

];
