import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisteredUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResult {
  token: string;
  username: string;
  role: string;
}

const TOKEN_STORAGE_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  register(payload: RegisterPayload): Observable<RegisteredUser> {
    return this.http.post<RegisteredUser>(`${this.baseUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${this.baseUrl}/login`, payload).pipe(
      tap((result) => localStorage.setItem(TOKEN_STORAGE_KEY, result.token))
    );
  }
}
