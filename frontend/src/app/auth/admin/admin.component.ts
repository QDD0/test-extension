import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe, JsonPipe } from '@angular/common';
import { TestService } from '../services/test.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [NgFor, NgIf, NgClass, DatePipe, JsonPipe]
})
export class AdminPanelComponent implements OnInit {

  users: any[] = [];
  attempts: any[] = [];
  violations: any[] = [];

  selectedUser: any = null;
  selectedAttempt: any = null;

  constructor(
    private router: Router,
    private testService: TestService) {

  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.testService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  selectUser(user: any) {
    console.log('Выбран пользователь:', user);
    console.log('ID пользователя:', user.id_person);
    this.selectedUser = user;

    this.testService.getUserAttempts(user.id_person).subscribe({
      next: (data) => {
        console.log('Получены попытки:', data);
        console.log('Тип данных:', typeof data);
        console.log('Это массив?', Array.isArray(data));
        console.log('Количество попыток:', Array.isArray(data) ? data.length : 'не массив');
        this.attempts = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Ошибка получения попыток:', err);
        console.error('Статус ошибки:', err.status);
        console.error('Тело ошибки:', err.error);
        this.attempts = [];
      }
    });
  }

  loadViolations(attempt: any): void {
    this.selectedAttempt = attempt;

    this.testService.getViolations(attempt.id_attempt).subscribe({
      next: (data) => {
        console.log('Полученные данные о нарушениях:', data);
        this.violations = data;
      },
      error: (err) => {
        console.error('Ошибка загрузки нарушений:', err);
      }
    });
  }

  exit() {
    this.router.navigate(['/tests-page']);
  }
}
