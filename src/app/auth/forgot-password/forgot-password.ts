import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoggerService } from '../../shared/services/logger.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  private router = inject(Router);
  private logger = inject(LoggerService);
  email: string = '';

  onResetRequest() {
    this.logger.info('Recovery Pulse Sent to:', this.email);
    // Logic for sending recovery email
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }
}
