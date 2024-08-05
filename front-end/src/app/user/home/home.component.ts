import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CarouselModule } from 'primeng/carousel';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../products.service';
import { Product } from '../../shared/models/product';
import { CardModule } from 'primeng/card';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { ProductAttributesService } from '../../products_attributes.service';
import { Category } from '../../shared/models/productAttributes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CarouselModule, ButtonModule, CardModule, FooterComponent,MatGridListModule,MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class UserDashboardComponent {
  products: Product[] = [];
  categories: Category[] = [];


  constructor(
    private router: Router,
    private productService: ProductService,
    private productAttributesService: ProductAttributesService,
    private cdRef:ChangeDetectorRef){}
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }
  loadCategories(): void {
    this.productAttributesService.getCategories().subscribe({
      next: (categories) => {
        console.log("categories",categories);
        this.categories = categories;
      },
    });
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.cdRef.detectChanges(); // Update the template
    });
  }

  goToProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
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
