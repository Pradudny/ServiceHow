import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'authToken';
  private readonly loginApiUrl = '/api/authentication/login';
  private readonly loggedInSignal = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<string> {
    return this.http.post(this.loginApiUrl, payload, { responseType: 'text' }).pipe(
      tap(responseText => {
        let token: string | null = null;

        try {
          const parsed = JSON.parse(responseText);
          token = parsed?.token ?? parsed?.accessToken ?? parsed?.jwt ?? responseText;
        } catch {
          token = responseText;
        }

        if (token) {
          sessionStorage.setItem(this.tokenKey, token);
          this.loggedInSignal.set(true);
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.loggedInSignal.set(false);
  }

  get token(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  get isLoggedIn(): boolean {
    return this.loggedInSignal();
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }
}
