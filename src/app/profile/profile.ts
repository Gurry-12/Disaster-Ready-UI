import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  isSaving = false;

  user = {
    name: 'Cmdr. Sarah Jenkins',
    email: 's.jenkins@disaster-ready.gov',
    role: 'Central Dispatch Coordinator',
    zone: 'Southwestern Sector (Grid 7)',
    id: 'DR-49022',
    phone: '+1 (555) 902-4422',
    status: 'On Duty',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    joined: new Date('2024-11-12')
  };

  profileForm = this.fb.group({
    name: [this.user.name, [Validators.required, Validators.minLength(3)]],
    email: [this.user.email, [Validators.required, Validators.email]],
    phone: [this.user.phone, [Validators.required]],
    status: [this.user.status, [Validators.required]]
  });

  recentActivity = [
    { action: 'Authorized Resource Deployment', target: 'Flood Zone B', time: '1h ago' },
    { action: 'Logged Critical Incident', target: 'Gas Leak - Sector 4', time: '4h ago' },
    { action: 'Updated Shelter Capacity', target: 'Green Valley High', time: '1d ago' }
  ];

  saveProfile() {
    if (this.profileForm.invalid) {
      this.notificationService.error('Please correct the errors in the form');
      return;
    }

    this.isSaving = true;

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      const formValue = this.profileForm.value;

      // Update local user object to reflect changes in UI
      this.user = {
        ...this.user,
        name: formValue.name || this.user.name,
        email: formValue.email || this.user.email,
        phone: formValue.phone || this.user.phone,
        status: formValue.status || this.user.status
      };

      this.notificationService.success('Profile updated successfully');
    }, 1500);
  }
}

