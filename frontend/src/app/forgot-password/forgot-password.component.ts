import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  errorMessage = '';
  isSubmitting = false;

  resetForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get email() {
    return this.resetForm.get('email');
  }

  requestReset() {
    if (this.resetForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const emailValue = this.resetForm.value.email!;

    this.authService.requestReset(emailValue)
      .subscribe({
        next: (response: { token: string }) => {  // ← Изменено: принимаем объект
          const token = response.token;            // ← Извлекаем токен из объекта
          localStorage.setItem('resetEmail', emailValue);
          this.router.navigate(['/reset-password', token]);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 404) {
            this.errorMessage = 'Пользователь с таким email не найден';
          } else {
            this.errorMessage = 'Произошла ошибка. Попробуйте позже';
          }
          console.error('Reset request error:', error);
        }
      });
  }
}
