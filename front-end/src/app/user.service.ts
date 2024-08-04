import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  searchBox: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private apiUrl = 'http://localhost:3000/api/users';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = sessionStorage.getItem('token')
   }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{token: string}>('http://localhost:3000/api/login', { username, password })
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

getUsers(): Observable<any> {
  const headers = new HttpHeaders({
    Authorization:`Bearer ${ this.getToken()}`
  });
  return this.http.get(this.apiUrl, { headers}).pipe (
    tap((response: any) =>{
      return response.map((user: {id: any; username: any; role: any; isActive: any}) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      }));
    })
  )
}



  logout(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${this.token}`
    });
    return this.http.post('http://localhost:3000/api/logout', {}, {headers}).pipe(
      tap(() =>{        
        sessionStorage.removeItem('token');
        this.token = null;
      })
    )
  }

  getUserStatus(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${username}/status`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  toggleUserStatus(username: string, isActive: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${username}/status`, { isActive }, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }
}