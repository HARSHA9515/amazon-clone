import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../app/products.service';
import { UserService } from '../../app/user.service';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { Product } from '../../shared/models/product';
import { CarouselModule } from 'primeng/carousel';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-admin-dahboard',
  standalone: true,
  imports: [TabViewModule,CarouselModule, TableModule, ButtonModule, ConfirmDialogModule, MessagesModule,CardModule, DialogModule, CommonModule, HeaderComponent, FormsModule, FooterComponent],
  templateUrl: './admin-dahboard.component.html',
  styleUrl: './admin-dahboard.component.scss',
  
})
export class AdminDahboardComponent implements OnInit {
  products: Product[] = [];
  productDialog: { isOpen: boolean, product: Product | null } = { isOpen: false, product: null };
  product: Product = new Product();
  users: any[] = [];
  errorMessage: string = '';
  displayModalProduct: boolean = false;
  deleteDialog: any;
  selectedProduct: any;

  constructor(private productService: ProductService, private userService: UserService, private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users.filter((user: { role: string; }) => user.role!== 'admin'),
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  createProduct(): void {
    this.productDialog = { isOpen: true, product: new Product() };
  }

  editProduct(product: Product): void {
    this.productDialog = { isOpen: true, product };
  }

  deleteProduct(product: Product): void {
    if (product.productId) {
      this.productService.deleteProduct(product.productId).subscribe(() => {
        this.loadProducts();
      });
    } else {
      console.error('Product ID is missing');
    }
  }

  saveProduct(): void {
    if (this.productDialog.product) {
      if (this.productDialog.product.productId) {
        // this.productService.updateProduct(this.productDialog.product).subscribe(() => {
        //   this.loadProducts();
        // });
      } else {
        this.productService.createProduct(this.productDialog.product).subscribe(() => {
          this.loadProducts();
        });
      }
    }
    this.productDialog.isOpen = false;
  }

  hideDialog(): void {
    this.productDialog.isOpen = false;
  }

  toggleUserStatus(user: any): void {
    const newStatus =!user.isActive;
    this.userService.toggleUserStatus(user.username, newStatus).subscribe({
      next: () => user.isActive = newStatus,
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  private handleError(error: HttpErrorResponse): void {
    this.errorMessage = error.message;
  }

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}