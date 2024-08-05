import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../products.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MatGridListModule, MatCardModule, CardModule, SkeletonModule, ButtonModule, InputNumberModule, FormsModule]
})
export class ProductComponent implements OnInit {
  product: any;
  quantityValue: number = 1;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(productId!).subscribe({
      next: product => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.loading = true;
      }
    });
  }
}
