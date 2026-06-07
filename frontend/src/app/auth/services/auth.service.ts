import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, ResetPasswordRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(res => localStorage.setItem('token', res.token))
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  requestReset(email: string): Observable<{token: string}> {
    return this.http.post<{token: string}>(
      `${this.apiUrl}/request-reset`,
      { email }
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/reset-password`,
      data
    );
  }
}
