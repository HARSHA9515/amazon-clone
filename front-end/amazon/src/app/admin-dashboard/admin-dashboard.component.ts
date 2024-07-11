import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../products.service';
import { UserService } from '../user.service';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [TabViewModule, TableModule, ButtonModule, DialogModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  users: any[] = [];

  constructor(private productService: ProductService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: any[]) => {
      this.products = products;
    });
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  createProduct(): void {
    // Implement create product logic
  }

  editProduct(product: any): void {
    // Implement edit product logic
  }

  deleteProduct(product: any): void {
    // Implement delete product logic
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}