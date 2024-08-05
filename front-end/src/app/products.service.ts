import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/products'; // Adjust the URL as needed

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      withCredentials: true
    };
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, this.getHttpOptions());
  }

  getProductById(productId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/${productId}`, this.getHttpOptions());
  }

  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product, this.getHttpOptions());
  }

  updateProduct(productId: string, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${productId}`, product, this.getHttpOptions());
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`, this.getHttpOptions());
  }
}
