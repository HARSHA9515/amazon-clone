import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../products.service';
import { ProductAttributesService } from '../../products_attributes.service';
import { UserService } from '../../user.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Product } from '../../shared/models/product';
import { Category,ProductType, ProductBrand } from '../../shared/models/productAttributes';
import { CarouselModule } from 'primeng/carousel';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [TabViewModule, CarouselModule, TableModule, ButtonModule, ConfirmDialogModule, MessagesModule, CardModule, DialogModule, CommonModule, HeaderComponent, FormsModule, FooterComponent, DropdownModule, InputTextareaModule, InputTextModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productTypes: ProductType[] = [];
  productBrands : ProductBrand[] = [];
  productDialog: { isOpen: boolean, product: Product } = { isOpen: false, product: new Product() };
  categoryDialog: { isOpen: boolean, category: Category } = { isOpen: false, category: new Category() };
  users: any[] = [];
  errorMessage: string = '';
  selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private productAttributesService: ProductAttributesService,
    private router: Router, private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProductTypes();
    this.loadProductBrands();
    this.loadProducts();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users.filter((user: { role: string; }) => user.role !== 'admin'),
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) =>{
        console.log("products",products)
         this.products = products
      },
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  loadCategories(): void {
    this.productAttributesService.getCategories().subscribe({
      next: (categories) => {
        console.log("categories",categories);
        this.categories = categories;
      },
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  loadProductBrands(): void {
    this.productAttributesService.getProductBrands().subscribe({
      next: (productBrands) => {
        console.log("productBrands",productBrands);
        this.productBrands = productBrands;
      },
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  loadProductTypes(): void {
    this.productAttributesService.getProductTypes().subscribe({
      next: (productTypes) => {
        this.productTypes = productTypes;
      },
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }
  createProduct(): void {
    this.productDialog = { isOpen: true, product: new Product() }; // Always initialize product
    this.selectedFile = null;
  }

  editProduct(product: Product): void {
    console.log("edit",product)
    this.productDialog = { isOpen: true, product: { ...product } }; // Use object spread to avoid mutation
    this.selectedFile = null;
  }

  deleteProduct(product: Product): void {
    if (product.id) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error: HttpErrorResponse) => this.handleError(error)
      });
    } else {
      console.error('Product ID is missing');
    }
  }

  saveProduct(): void {
    if (this.productDialog.product) {
      const formData = new FormData();
      formData.append('productName', this.productDialog.product.productName || '');
      formData.append('productDescription', this.productDialog.product.productDescription || '');
      formData.append('productPrice', this.productDialog.product.productPrice?.toString() || '');
      formData.append('categoryId', this.productDialog.product.categoryId || '');
      formData.append('productTypeId', this.productDialog.product.productTypeId || '');
      formData.append('brandNameId', this.productDialog.product.brandNameId || '');

      if (this.selectedFile) {
        formData.append('productImage', this.selectedFile, this.selectedFile.name);
      }

      if (this.productDialog.product.id) {
        // Ensure product ID is defined before update
        this.productService.updateProduct(this.productDialog.product.id, formData).subscribe({
          next: () => {
            this.loadProducts();
            this.hideDialog();
          },
          error: (error: HttpErrorResponse) => this.handleError(error)
        });
      } else {
        this.productService.createProduct(formData).subscribe({
          next: () => {
            this.loadProducts();
            this.hideDialog();
          },
          error: (error: HttpErrorResponse) => this.handleError(error)
        });
      }
    } else {
      console.error('Product data is missing');
    }
  }

  hideDialog(): void {
    this.productDialog.isOpen = false;
    this.selectedFile = null;
    this.productDialog.product = new Product(); // Reset the product data
    this.categoryDialog.isOpen = false;
    this.categoryDialog.category = new Category(); // Reset the category data
  }

  createCategory(): void {
    this.categoryDialog = { isOpen: true, category: new Category() };
  }

  editCategory(category: Category): void {
    this.categoryDialog = { isOpen: true, category: { ...category } };
  }

  deleteCategory(category: Category): void {
    if (category.id) {
      this.productAttributesService.deleteCategory(category.id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error: HttpErrorResponse) => this.handleError(error)
      });
    } else {
      console.error('Category ID is missing');
    }
  }

  saveCategory(): void {
    if (this.categoryDialog.category) {
      const formData = new FormData();
      formData.append('name', this.categoryDialog.category.name || '');
      formData.append('description', this.categoryDialog.category.description || '');

      if (this.selectedFile) {
        formData.append('categoryImg', this.selectedFile, this.selectedFile.name);
      }

      if (this.categoryDialog.category.id) {
        // Ensure product ID is defined before update
        this.productAttributesService.updateCategory(this.categoryDialog.category.id, formData).subscribe({
          next: () => {
            this.loadCategories();
            this.hideDialog();
          },
          error: (error: HttpErrorResponse) => this.handleError(error)
        });
      } else {
        this.productAttributesService.createCategory(formData).subscribe({
          next: () => {
            this.loadCategories();
            this.hideDialog();
          },
          error: (error: HttpErrorResponse) => this.handleError(error)
        });
      }
    } else {
      console.error('Product data is missing');
    }
  }


  toggleUserStatus(user: any): void {
    const newStatus = !user.isActive;
    this.userService.toggleUserStatus(user.username, newStatus).subscribe({
      next: () => user.isActive = newStatus,
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  getCategoryNameById(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '-';
  }

  getBrandNameById(brandNameId: string): string {
    const brand = this.productBrands.find(brand => brand.id === brandNameId);
    return brand ? brand.name : '-';
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
