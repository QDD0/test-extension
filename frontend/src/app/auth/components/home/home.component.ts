import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TestService } from '../../services/test.service';
import { Test } from '../../models/auth.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tests: Test[] = [];

  constructor(
    private router: Router,
    private testService: TestService
  ) { }

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests() {
    this.testService.getAllTests().subscribe({
      next: (data) => {
        this.tests = data;
      },
      error: (err) => {
        console.error('Ошибка загрузки тестов', err);
      }
    });
  }

  // startTest(testId: number) {
  //   const win = window as any;
  //
  //   if (!win.__testProtectionAPI) {
  //     alert('Включите расширение для прохождения теста');
  //     return;
  //   }
  //
  //   this.testService.startTest(testId).subscribe({
  //     next: () => {
  //       this.router.navigate(['/test-start', testId]);
  //     },
  //     error: (err) => {
  //       console.error('Не удалось начать тест', err);
  //     }
  //   });
  // }

  startTest(testId: number) {
    const win = window as any;

    // Проверяем только наличие расширения (не isActive!)
    if (!win.__testProtectionAPI) {
      alert(
        'Расширение не обнаружено.\n\n' +
        'Обновите страницу (F5) или включите расширение.'
      );
      return;
    }

    this.testService.startTest(testId).subscribe({
      next: () => {
        this.router.navigate(['/test-start', testId]);
      },
      error: (err) => {
        console.error('Ошибка запуска теста', err);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
