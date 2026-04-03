import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Question, Test } from '../models/auth.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-test-start',
  templateUrl: './test-start.component.html',
  styleUrls: ['./test-start.component.css'],
  imports: [CommonModule, NgIf, NgFor]
})
export class TestStartComponent implements OnInit, OnDestroy {
  isFinished = false;
  tabSwitchCount = 0;

  questions: Question[] = [];
  testId!: number;
  attemptId!: number;
  testDuration: number = 0;
  remainingTime: number = 0;
  timer: any;
  userAnswers: any = {};

  private boundSave = this.saveProgress.bind(this);
  private boundHandleViolation = this.handleViolation.bind(this);

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    console.log('TestStartComponent initialized');

    this.testId = Number(this.route.snapshot.paramMap.get('id'));
    this.startAttempt();

    window.addEventListener('beforeunload', this.boundSave);
    window.addEventListener('testViolation', this.boundHandleViolation);

    this.notifyExtensionReady();

    this.checkExtensionStatus();
  }

  ngOnDestroy(): void {
    console.log('TestStartComponent destroyed');
    clearInterval(this.timer);
    window.removeEventListener('beforeunload', this.boundSave);
    window.removeEventListener('testViolation', this.boundHandleViolation);
  }

  notifyExtensionReady() {
    window.dispatchEvent(new CustomEvent('angularTestReady', {
      detail: { testId: this.testId, timestamp: Date.now() }
    }));
  }

  checkExtensionStatus() {
    setTimeout(() => {
      const win = window as any;
      if (win.__testProtectionAPI) {
        console.log('Extension is loaded and ready');
        const status = win.__testProtectionAPI.status();
        console.log('Extension status:', status);
      } else {
        console.warn('Extension not detected!');
      }
    }, 1000);
  }

  handleViolation(event: any) {
    this.ngZone.run(() => {
      const { reason, count } = event.detail;
      console.log(`Violation: ${reason}`, event.detail);

      switch(reason) {
        case 'tabSwitchWarning':
          this.tabSwitchCount = count || 1;
          console.warn(`Tab switch warning #${this.tabSwitchCount}`);
          break;

        case 'tabSwitchViolation':
        case 'devToolsViolation':
        case 'devToolsDetected':
          console.error(`Test finished due to: ${reason}`);
          this.finishTest();
          break;

        case 'extensionReady':
          console.log('Extension is ready and protection is active');
          break;
      }
    });
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
