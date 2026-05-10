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
  filteredViolations: any[] = [];
  paginatedViolations: any[] = [];

  selectedUser: any = null;
  selectedAttempt: any = null;

  searchQuery: string = '';

  currentUsersPage = 1;
  usersPerPage = 8;

  currentAttemptsPage = 1;
  attemptsPageSize = 5;

  currentViolationsPage = 1;
  violationsPerPage = 10;

  sortAttempts = 'newest';

  violationsAnalysis = {
    total: 0,
    byType: {} as { [key: string]: number },
    criticalCount: 0,
    warningCount: 0,
    frequentType: '',
    frequentCount: 0
  };

  constructor(
    private router: Router,
    private testService: TestService
  ) {}

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

      const fullName =
        `${user.first_name || ''} ${user.last_name || ''} ${user.surname || ''}`
          .toLowerCase();

      const email = (user.email || '').toLowerCase();

      return fullName.includes(query) || email.includes(query);
    });

    this.currentUsersPage = 1;
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredUsers = this.users;
  }

  selectUser(user: any) {

    this.selectedUser = user;

    this.selectedAttempt = null;

    this.violations = [];

    this.resetViolationsAnalysis();

    this.testService.getUserAttempts(user.id_person).subscribe({
      next: (data) => {

        this.attempts =
          Array.isArray(data) ? data : [];

        this.sortAttemptsList();
      },

      error: () => {
        this.attempts = [];
      }
    });
  }

  sortAttemptsList() {

    switch (this.sortAttempts) {

      case 'newest':
        this.attempts.sort((a, b) =>
          new Date(b.start_time).getTime() -
          new Date(a.start_time).getTime()
        );
        break;

      case 'oldest':
        this.attempts.sort((a, b) =>
          new Date(a.start_time).getTime() -
          new Date(b.start_time).getTime()
        );
        break;

      case 'score':
        this.attempts.sort((a, b) =>
          (b.score || 0) - (a.score || 0)
        );
        break;
    }
  }

  loadViolations(attempt: any): void {
    this.selectedAttempt = attempt;

    this.testService.getViolations(attempt.id_attempt).subscribe({
      next: (data) => {

        this.violations = data;

        this.filteredViolations = [...data];

        this.updateViolationsPagination();

        this.analyzeViolations(data);
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  updateViolationsPagination() {
    const start =
      (this.currentViolationsPage - 1) *
      this.violationsPerPage;

    const end = start + this.violationsPerPage;

    this.paginatedViolations =
      this.filteredViolations.slice(start, end);
  }

  changeUsersPage(page: number) {
    this.currentUsersPage = page;
  }

  changeViolationsPage(page: number) {
    this.currentViolationsPage = page;
    this.updateViolationsPagination();
  }

  get paginatedUsers(): any[] {
    const start =
      (this.currentUsersPage - 1) *
      this.usersPerPage;

    const end = start + this.usersPerPage;

    return this.filteredUsers.slice(start, end);
  }

  get totalUsersPages(): number {
    return Math.ceil(
      this.filteredUsers.length / this.usersPerPage
    );
  }

  get totalViolationsPages(): number {
    return Math.ceil(
      this.filteredViolations.length /
      this.violationsPerPage
    );
  }

  get paginatedAttempts() {
    const start = (this.currentAttemptsPage - 1) * this.attemptsPageSize;
    return this.attempts.slice(start, start + this.attemptsPageSize);
  }

  get totalAttemptsPages() {
    return Math.ceil(this.attempts.length / this.attemptsPageSize);
  }

  changeAttemptsPage(page: number) {
    this.currentAttemptsPage = page;
  }

  analyzeViolations(violations: any[]): void {
    this.resetViolationsAnalysis();

    if (!violations || violations.length === 0) {
      return;
    }

    this.violationsAnalysis.total = violations.length;

    const typeCount: { [key: string]: number } = {};

    violations.forEach(violation => {
      const type =
        violation.event_type ||
        violation.violationType;

      if (type) {
        typeCount[type] =
          (typeCount[type] || 0) + 1;
      }

      if (
        type === 'COPY_ATTEMPT' ||
        type === 'SCREENSHOT' ||
        type === 'APP_CHANGE'
      ) {
        this.violationsAnalysis.criticalCount++;
      }

      if (
        type === 'TAB_SWITCH' ||
        type === 'WINDOW_BLUR'
      ) {
        this.violationsAnalysis.warningCount++;
      }
    });

    this.violationsAnalysis.byType = typeCount;
    let maxCount = 0;
    let frequentType = '';

    Object.entries(typeCount).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        frequentType = type;
      }
    });

    this.violationsAnalysis.frequentType = frequentType;
    this.violationsAnalysis.frequentCount = maxCount;
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
      'SCREENSHOT': 'Скриншот'
    };
    return types[eventType] || eventType;
  }

  getViolationCountText(count: number): string {
    if (count === 1) return 'раз';
    if (count >= 2 && count <= 4) return 'раза';
    return 'раз';
  }

  getViolationTypes(): string[] {
    return Object.keys(this.violationsAnalysis.byType);
  }
}
