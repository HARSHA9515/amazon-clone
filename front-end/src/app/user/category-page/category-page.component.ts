import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'category-page',
  standalone: true,
  imports: [HeaderComponent, CarouselModule, ButtonModule, CardModule, FooterComponent, MatGridListModule, MatCardModule],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    this.productService.getProducts(categoryId).subscribe((products: Product[]) => {
      this.products = products;
      this.cdRef.detectChanges();
    });
  }

  goToProduct(productId: string | undefined): void {
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
