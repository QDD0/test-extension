import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestService } from '../services/test.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [NgFor, NgIf, DatePipe, FormsModule]
})
export class AdminPanelComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  attempts: any[] = [];
  violations: any[] = [];

  violationsAnalysis = {
    total: 0,
    byType: {} as { [key: string]: number },
    criticalCount: 0,
    warningCount: 0,
    frequentType: '',
    frequentCount: 0
  };

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
      this.filteredUsers = data;
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
    this.resetViolationsAnalysis();

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
        this.analyzeViolations(data);
      },
      error: (err) => {
        console.error('Ошибка загрузки нарушений:', err);
      }
    });
  }

  analyzeViolations(violations: any[]): void {
    this.resetViolationsAnalysis();

    if (!violations || violations.length === 0) {
      return;
    }

    this.violationsAnalysis.total = violations.length;

    const typeCount: { [key: string]: number } = {
      'TAB_SWITCH': 0,
      'WINDOW_BLUR': 0,
      'APP_CHANGE': 0,
      'COPY_ATTEMPT': 0,
      'SCREENSHOT': 0
    };

    violations.forEach(violation => {
      const type = violation.event_type || violation.violationType;
      console.log('Тип нарушения:', type, 'Объект:', violation);

      if (type && typeCount.hasOwnProperty(type)) {
        typeCount[type] = (typeCount[type] || 0) + 1;
      } else if (type) {
        typeCount[type] = (typeCount[type] || 0) + 1;
      }

      if (type === 'COPY_ATTEMPT' || type === 'SCREENSHOT' || type === 'APP_CHANGE') {
        this.violationsAnalysis.criticalCount++;
      }

      if (type === 'TAB_SWITCH' || type === 'WINDOW_BLUR') {
        this.violationsAnalysis.warningCount++;
      }
    });

    const filteredTypeCount: { [key: string]: number } = {};
    Object.keys(typeCount).forEach(key => {
      if (typeCount[key] > 0) {
        filteredTypeCount[key] = typeCount[key];
      }
    });

    this.violationsAnalysis.byType = Object.keys(filteredTypeCount).length > 0 ? filteredTypeCount : typeCount;

    let maxCount = 0;
    let frequentType = '';

    Object.entries(this.violationsAnalysis.byType).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        frequentType = type;
      }
    });

    this.violationsAnalysis.frequentType = frequentType;
    this.violationsAnalysis.frequentCount = maxCount;

    console.log('Анализ нарушений:', this.violationsAnalysis);
    console.log('byType:', this.violationsAnalysis.byType);
  }

  resetViolationsAnalysis(): void {
    this.violationsAnalysis = {
      total: 0,
      byType: {},
      criticalCount: 0,
      warningCount: 0,
      frequentType: '',
      frequentCount: 0
    };
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
      'SCREENSHOT': 'Скриншот',
      'copyAttempt': 'Попытка копирования',
      'pasteAttempt': 'Попытка вставки',
      'tabSwitchWarning': 'Переключение вкладки',
      'window_lost_focus': 'Уход из окна',
      'windowFocus': 'Возврат в окно',
      'tabReturn': 'Возврат во вкладку',
      'contextMenuAttempt': 'Вызов контекстного меню',
      'screenshotPattern': 'Попытка скриншота',
      'screenRecordingAttempt': 'Попытка записи экрана',
      'screenshotSuspicion': 'Подозрение на скриншот',
      'devToolsDetected': 'Инструменты разработчика',
      'devToolsViolation': 'Нарушение: DevTools'
    };
    return types[eventType] || eventType;
  }

  getViolationCountText(count: number): string {
    if (count === 0) return 'раз';
    if (count === 1) return 'раз';
    if (count >= 2 && count <= 4) return 'раза';
    return 'раз';
  }

  getViolationTypes(): string[] {
    return Object.keys(this.violationsAnalysis.byType);
  }
}
