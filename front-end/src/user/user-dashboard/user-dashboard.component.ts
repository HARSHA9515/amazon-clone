import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../app/products.service';
import { Product } from '../../shared/models/product';
import { CardModule } from 'primeng/card';
import { FooterComponent } from "../../shared/components/footer/footer.component";


@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [HeaderComponent, CarouselModule, ButtonModule, CardModule, FooterComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {
  products: Product[] = [];


  constructor(private productService: ProductService,private cdRef:ChangeDetectorRef){}
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    console.log('Loading products...');
    this.productService.getProducts().subscribe((products: Product[]) => {
      console.log('Received products:', products);
      this.products = products;
      this.cdRef.detectChanges(); // Update the template
    });
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
