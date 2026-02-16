import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../../shared/models/login-request.model';
import { environment } from '../../../environments/environment';

import { LoggerService } from '../../shared/services/logger.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  rememberMe = false;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/dashboard';
  isDevMode = !environment.production;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) {
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  fillDemoCredentials() {
    this.email = 'admin@disaster-ready.com';
    this.password = 'password';
  }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        this.logger.error('Login error', error);
      }
    });
  }

  onSignupClick() {
    this.router.navigate(['/signup']);
  }

  onForgotPasswordClick() {
    this.router.navigate(['/forgot-password']);
  }
}
