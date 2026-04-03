import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Question, Test} from '../models/auth.model';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {TestService} from '../services/test.service';

@Component({
  selector: 'app-test-start',
  templateUrl: './test-start.component.html',
  styleUrls: ['./test-start.component.css'],
  imports: [CommonModule, NgIf, NgFor]
})
export class TestStartComponent implements OnInit, OnDestroy {
  tabSwitchCount = 0;
  isFinished = false;

  questions: Question[] = [];
  testId!: number;
  attemptId!: number;
  testDuration: number = 0;
  remainingTime: number = 0;
  timer: any;
  userAnswers: any = {};

  private boundSave = this.saveProgress.bind(this);

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router
  ) {
  }

  handleTabChange = () => {
    if (document.hidden) {
      this.tabSwitchCount++;

      console.warn('Переключение вкладки:', this.tabSwitchCount);

      if (this.tabSwitchCount === 1) {
        alert('Не покидайте вкладку! При повторном нарушении тест будет завершен.');
      } else if (this.tabSwitchCount >= 2) {
        alert('Вы повторно покинули вкладку. Тест завершен.');
        this.finishTest();
      }
    }
  }

  detectDevToolsKeys = (event: KeyboardEvent) => {
    if (
      event.key === 'F12' ||
      (event.ctrlKey && event.shiftKey && event.key === 'I') ||
      (event.ctrlKey && event.shiftKey && event.key === 'J') ||
      (event.ctrlKey && event.key === 'U')
    ) {
      event.preventDefault();

      alert('Открытие DevTools запрещено! Тест будет завершен.');
      this.finishTest();
    }
  }

  disableCopy = (event: ClipboardEvent) => {
    event.preventDefault();
  }

  disableSelect = () => {
    return false;
  }

  checkDevTools() {
    const threshold = 160;

    setInterval(() => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > threshold || heightDiff > threshold) {
        alert('DevTools обнаружены! Тест завершен.');
        this.finishTest();
      }
    }, 1000);
  }

  ngOnInit(): void {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));
    this.startAttempt();
    this.checkDevTools();

    window.addEventListener('beforeunload', this.boundSave);
    document.addEventListener('visibilitychange', this.handleTabChange);
    window.addEventListener('blur', this.handleTabChange);
    document.addEventListener('keydown', this.detectDevToolsKeys);
    document.addEventListener('copy', this.disableCopy);
    document.addEventListener('cut', this.disableCopy);
    document.addEventListener('selectstart', this.disableSelect);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    window.removeEventListener('beforeunload', this.boundSave);
    document.removeEventListener('visibilitychange', this.handleTabChange);
    window.removeEventListener('blur', this.handleTabChange);
    document.removeEventListener('keydown', this.detectDevToolsKeys);
    document.removeEventListener('copy', this.disableCopy);
    document.removeEventListener('cut', this.disableCopy);
    document.removeEventListener('selectstart', this.disableSelect);
  }

  startAttempt() {
    this.testService.startTest(this.testId).subscribe({
      next: (attempt: any) => {
        this.attemptId = attempt.id_attempt;
        console.log('Attempt started with ID:', this.attemptId);
        this.loadTestInfo();
      },
      error: (err) => {
        console.error('Ошибка старта попытки', err);
      }
    });
  }

  loadTestInfo() {
    this.testService.getTestById(this.testId).subscribe({
      next: (test: Test) => {
        this.testDuration = test.duration_minutes || 30;
        this.remainingTime = this.testDuration * 60;
        this.loadQuestions();
        this.startTimer();
      },
      error: () => {
        this.testDuration = 30;
        this.remainingTime = 30 * 60;
        this.loadQuestions();
        this.startTimer();
      }
    });
  }

  loadQuestions() {
    this.testService.getQuestions(this.testId).subscribe({
      next: (data: Question[]) => {
        this.questions = data;
      },
      error: (err) => {
        console.error('Error loading questions:', err);
      }
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timer);
        this.finishTest();
      }
    }, 1000);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  saveProgress(event?: any) {
    if (!this.attemptId) return;

    this.testService.saveProgress(this.attemptId, this.userAnswers)
      .subscribe({
        next: () => console.log('Progress saved'),
        error: (err) => console.error('Error saving progress:', err)
      });

    if (event) {
      event.returnValue = 'Вы точно хотите выйти?';
    }
  }

  finishTest() {
    if (this.isFinished) return;
    this.isFinished = true;

    clearInterval(this.timer);

    if (!this.attemptId) {
      console.error('No attempt ID found');
      return;
    }

    console.log('Finishing test with attemptId:', this.attemptId);
    console.log('User answers:', this.userAnswers);

    this.testService.submitTest({
      testId: this.testId,
      answers: this.userAnswers
    }).subscribe({
      next: () => {
        this.router.navigate(['/result', this.attemptId]);
      },
      error: () => {
        this.router.navigate(['/result', this.attemptId]);
      }
    });
  }

  toggleMultiple(questionId: number, answerId: number, event: any) {
    if (!this.userAnswers[questionId]) {
      this.userAnswers[questionId] = [];
    }

    if (event.target.checked) {
      this.userAnswers[questionId].push(answerId);
    } else {
      this.userAnswers[questionId] =
        this.userAnswers[questionId].filter((id: number) => id !== answerId);
    }

    console.log('Updated answers:', this.userAnswers);
  }
}
