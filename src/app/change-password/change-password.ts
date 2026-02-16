import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {
  private fb = inject(FormBuilder);

  isUpdating = false;
  success = false;

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: (group) => {
      const pass = group.get('newPassword')?.value;
      const confirm = group.get('confirmPassword')?.value;
      return pass === confirm ? null : { mismatch: true };
    }
  });

  onSubmit() {
    if (this.passwordForm.valid) {
      this.isUpdating = true;
      setTimeout(() => {
        this.isUpdating = false;
        this.success = true;
        this.passwordForm.reset();
      }, 1500);
    }
  }

  resetState() {
    this.success = false;
    this.passwordForm.reset();
  }
}
