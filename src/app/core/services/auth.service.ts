
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5097/api/Auth';

  login(data: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(
      tap(response => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  register(data: RegisterDto): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/register`,
      data,
      { responseType: 'text' }
    );
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const base64 = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const decoded = JSON.parse(
        atob(base64)
      );

      return (
        decoded['role'] ??
        decoded['roles'] ??
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
        null
      );

    } catch {
      return null;
    }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}
