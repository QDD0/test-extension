import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestService } from '../services/test.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [NgFor, NgIf, NgClass, DatePipe, JsonPipe, FormsModule]
})
export class AdminPanelComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  attempts: any[] = [];
  violations: any[] = [];

  selectedUser: any = null;
  selectedAttempt: any = null;

  searchQuery: string = '';

  constructor(
    private router: Router,
    private testService: TestService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.testService.getUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = data; // Изначально показываем всех
    });
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(user => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''} ${user.surname || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();

      return fullName.includes(query) || email.includes(query);
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredUsers = this.users;
  }

  selectUser(user: any) {
    console.log('Выбран пользователь:', user);
    console.log('ID пользователя:', user.id_person);
    this.selectedUser = user;
    this.selectedAttempt = null;
    this.violations = [];

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

  getStatusText(status: string): string {
    const statuses: { [key: string]: string } = {
      'IN_PROGRESS': 'В процессе',
      'COMPLETED': 'Завершен',
      'BLOCKED': 'Заблокирован'
    };
    return statuses[status] || status;
  }

  getViolationClass(eventType: string): string {
    const classes: { [key: string]: string } = {
      'TAB_SWITCH': 'violation-warning',
      'WINDOW_BLUR': 'violation-info',
      'APP_CHANGE': 'violation-danger',
      'COPY_ATTEMPT': 'violation-critical',
      'SCREENSHOT': 'violation-danger'
    };
    return classes[eventType] || 'violation-default';
  }

  getViolationText(eventType: string): string {
    const types: { [key: string]: string } = {
      'TAB_SWITCH': 'Переключение вкладки',
      'WINDOW_BLUR': 'Уход из окна',
      'APP_CHANGE': 'Смена приложения',
      'COPY_ATTEMPT': 'Попытка копирования',
      'SCREENSHOT': 'Скриншот'
    };
    return types[eventType] || eventType;
  }
}
