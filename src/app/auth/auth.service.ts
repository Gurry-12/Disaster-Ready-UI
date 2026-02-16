import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { LoginRequest, LoginResponse, SignupRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../shared/models/login-request.model';
import { environment } from '../../environments/environment';
import { LoggerService } from '../shared/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private router = inject(Router);
  private logger = inject(LoggerService);

  constructor() {
    this.loadStoredAuth();
  }

  // Get current values
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Login method
  // TODO: Replace with actual API call to backend authentication service
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // WARNING: This is a mock implementation for development only
    // In production, this MUST call a secure backend API
    return new Observable(observer => {
      setTimeout(() => {
        // SECURITY: Never hardcode credentials in production
        // This is for development/demo purposes only
        const isDemoMode = !environment.production;

        if (isDemoMode && loginRequest.email === 'admin@disaster-ready.com' && loginRequest.password === 'password') {
          const mockResponse: LoginResponse = {
            user: {
              id: 1,
              email: loginRequest.email,
              name: 'Admin User',
              role: 'admin'
            },
            token: this.generateMockJWT(loginRequest.email, 3600),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            expiresIn: 3600
          };

          this.handleSuccessfulLogin(mockResponse);
          observer.next(mockResponse);
          observer.complete();
        } else {
          observer.error(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  // Generate a mock JWT token with proper structure for development
  private generateMockJWT(email: string, expiresIn: number): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      email: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn
    }));
    const signature = btoa('mock-signature-' + Date.now());
    return `${header}.${payload}.${signature}`;
  }

  // Signup method
  signup(signupRequest: SignupRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const mockResponse: LoginResponse = {
          user: {
            id: Date.now(),
            email: signupRequest.email,
            name: signupRequest.name,
            role: 'volunteer'
          },
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600
        };

        this.handleSuccessfulLogin(mockResponse);
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }

  // Forgot password
  forgotPassword(request: ForgotPasswordRequest): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        // Simulate sending reset email
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  // Reset password
  resetPassword(request: ResetPasswordRequest): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        // Simulate password reset
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  // Logout
  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  // Refresh token
  refreshToken(): Observable<string> {
    return new Observable(observer => {
      setTimeout(() => {
        const newToken = 'mock-jwt-token-refreshed-' + Date.now();
        this.tokenSubject.next(newToken);
        localStorage.setItem('token', newToken);
        observer.next(newToken);
        observer.complete();
      }, 500);
    });
  }

  // Check if token is valid
  isTokenValid(): boolean {
    const token = this.token;
    if (!token) return false;

    try {
      // Decode JWT token and check expiration
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Decode payload (second part of JWT)
      const payload = JSON.parse(atob(parts[1]));

      // Check if token has expiration
      if (!payload.exp) return false;

      // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;

      if (isExpired) {
        // Token is expired, clear auth state
        this.clearAuth();
        return false;
      }

      return true;
    } catch (error) {
      // Invalid token format
      this.logger.error('Token validation failed', error);
      this.clearAuth();
      return false;
    }
  }

  // Private methods
  private handleSuccessfulLogin(response: LoginResponse): void {
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      role: response.user.role as any,
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    this.logger.logAuthEvent('Login successful', user.id);

    this.currentUserSubject.next(user);
    this.tokenSubject.next(response.token);
    this.isAuthenticatedSubject.next(true);

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  private loadStoredAuth(): void {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.tokenSubject.next(storedToken);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  private clearAuth(): void {
    const user = this.currentUser;
    if (user) {
      this.logger.logAuthEvent('Logout', user.id);
    }

    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}