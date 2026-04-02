import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/services/auth.service';
import {RegisterRequest} from '../auth/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    surname: ''
  };

  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  passwordsMatch(): boolean {
    return this.registerData.password === this.confirmPassword;
  }

  onSubmit() {
    if (!this.passwordsMatch()) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.successMessage = response.message || 'Registration successful!';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
