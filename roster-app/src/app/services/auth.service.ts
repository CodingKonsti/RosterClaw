import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  isEmailConfirmed: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private loggedIn = signal(false);

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<void>('/api/login?useCookies=true', credentials, { withCredentials: true }).pipe(
      tap(() => this.loggedIn.set(true))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.loggedIn.set(false))
    );
  }

  getInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>('/api/manage/info', { withCredentials: true });
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  setLoggedIn(value: boolean): void {
    this.loggedIn.set(value);
  }
}
