import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, ProductBrand, ProductType } from './shared/models/productAttributes';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributesService {
  private baseUrl = 'http://localhost:3000/api/product_attributes'; // Adjust the URL as needed
  private categoriesUrl = `${this.baseUrl}/categories`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = sessionStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      }),
      withCredentials: true
    };
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl, this.getHttpOptions());
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.categoriesUrl}/${id}`, this.getHttpOptions());
  }

  createCategory(category: FormData): Observable<Category> {
    return this.http.post<Category>(this.categoriesUrl, category, this.getHttpOptions());
  }

  updateCategory(id: string, category: FormData): Observable<void> {
    return this.http.put<void>(`${this.categoriesUrl}/${id}`, category, this.getHttpOptions());
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.categoriesUrl}/${id}`, this.getHttpOptions());
  }

  getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.baseUrl}/product_types`, this.getHttpOptions());
  }

  getProductBrands(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.baseUrl}/brands`, this.getHttpOptions());
  }
}
