import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getProducts(): any {
    return this.http.get(`${this.apiUrl}/products`);
  }

  createProduct(product: any): any {
    return this.http.post(`${this.apiUrl}/products`, product);
  }

  editProduct(product: any): any {
    return this.http.put(`${this.apiUrl}/products/${product.id}`, product);
  }

  deleteProduct(product: any): any {
    return this.http.delete(`${this.apiUrl}/products/${product.id}`);
  }

}