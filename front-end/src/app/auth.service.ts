import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/login';
  isAdmin: any;

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string, password: string }): any {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(this.apiUrl, credentials, { headers })
    .pipe(
        tap((response) => {
          // Store the token in Session Storage
          sessionStorage.setItem('token', response.token);
          if (response.user.role === 'admin') {
            this.router.navigate(['admin-dashboard']);
          } else if (response.user.role === 'user') {
            this.router.navigate(['user-dashboard']);
          }
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  logout(): void {
    // Remove the token from Session Storage
    sessionStorage.removeItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return!!this.getToken();
  }
}