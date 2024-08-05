import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  searchBox: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private apiUrl = 'http://localhost:3000/api/auth';
  private token: string | null = null;
  private userRole: string | null = null;
  constructor(private http: HttpClient) {
    this.token = sessionStorage.getItem('token')
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Unable to authenticate!!! An error occurred; please try again later.'));
  }
  checkSession(): Observable<{role: string}> {
    return this.http.get<{ role: string }>(`${this.apiUrl}/checkSession`, { withCredentials: true }).pipe(
      tap(response => {
        this.userRole = response.role;
        return response;
      }),
      catchError(this.handleError)
    );
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  setUserRole(role: string): void {
    this.userRole = role;
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, credentials, {withCredentials: true})
      .pipe(
        tap((response) => {
          this.setToken(response.token);
        })
      );
  }

  private setToken(token: string): void {
    sessionStorage.setItem('token', token);
    this.token = token;
  }
  private getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${this.token}`
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, {headers, withCredentials: true}).pipe(
      tap(() =>{
        sessionStorage.removeItem('token');
        this.token = null;
      })
    )
  }
}
