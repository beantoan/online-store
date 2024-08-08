import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserModel } from '../../models/user/user.model';
import { isPlatformBrowser } from '@angular/common';

interface AuthResponse {
  message: string;
  token: string;
  user: UserModel;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private loggedOutSubject = new BehaviorSubject<boolean>(false);
  public loggedOut$ = this.loggedOutSubject.asObservable();
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.setCurrentUser(token, {id: 0, username: '', email: ''});
      }
    }
  }

  get currentUserValue(): UserModel | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {email, password})
      .pipe(
        tap(({token, user}) => this.setCurrentUser(token, user))
      );
  }

  register(user: { username: string, email: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(
        tap(({token, user}) => this.setCurrentUser(token, user))
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.loggedOutSubject.next(true);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setCurrentUser(token: string, user: UserModel): void {
    if (user && token) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', token);
      }
      this.currentUserSubject.next(user);
    }
  }
}
