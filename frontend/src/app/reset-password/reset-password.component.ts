import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {AuthService} from '../auth/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting = false;

  resetForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    this.email = localStorage.getItem('resetEmail') || '';

    if (!this.token) {
      this.errorMessage = 'Недействительная ссылка для сброса пароля';
    }
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  resetPassword() {
    if (this.resetForm.invalid || this.isSubmitting) {
      return;
    }

    const newPasswordValue = this.newPassword?.value;
    const confirmPasswordValue = this.confirmPassword?.value;

    // Проверка совпадения паролей
    if (newPasswordValue !== confirmPasswordValue) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPassword({
      token: this.token,
      newPassword: newPasswordValue!
    }).subscribe({
      next: (response: any) => {
        this.successMessage = 'Пароль успешно изменен!';
        localStorage.removeItem('resetEmail');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 400) {
          if (error.error?.message?.includes('истек')) {
            this.errorMessage = 'Срок действия ссылки истек. Запросите новую.';
          } else {
            this.errorMessage = 'Недействительная ссылка для сброса пароля';
          }
        } else {
          this.errorMessage = 'Ошибка при смене пароля. Попробуйте позже.';
        }
        console.error('Reset password error:', error);
      }
    });
  }
}
