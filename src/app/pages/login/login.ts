import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

email = '';
  password = '';

  onLogin() {
    console.log('Logging in with:', this.email, this.password);
    // TODO: Call authentication service
  }
}
