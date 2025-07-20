import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-signup',
  standalone : true,
  imports: [  FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  name = '';
  email = '';
  password = '';

  onSignup() {
    console.log('Signing up:', this.name, this.email, this.password);
    // TODO: Call registration service
  }

}
