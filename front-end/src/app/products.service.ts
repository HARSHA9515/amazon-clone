import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Product } from '../shared/models/product';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/products';
  private token: string | null = sessionStorage.getItem('token');
  constructor(private http: HttpClient) { }


  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`)
      .pipe(
        tap(data => console.log('Product: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product)
      .pipe(
        tap(data => console.log('Product: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product)
      .pipe(
        tap(data => console.log('Product: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(data => console.log('Product: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err: any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}