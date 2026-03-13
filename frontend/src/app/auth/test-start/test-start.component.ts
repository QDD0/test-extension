import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, Test } from '../models/auth.model';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-test-start',
  templateUrl: './test-start.component.html',
  styleUrls: ['./test-start.component.css'],
  imports: [CommonModule, NgIf, NgFor]
})
export class TestStartComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  testId!: number;
  attemptId!: number;
  testDuration: number = 0;
  remainingTime: number = 0;
  timer: any;
  userAnswers: any = {};

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));
    this.startAttempt();
    window.addEventListener('beforeunload', this.saveProgress.bind(this));
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    window.removeEventListener('beforeunload', this.saveProgress.bind(this));
  }

  startAttempt() {
    this.testService.startTest(this.testId).subscribe({
      next: (attempt: any) => {
        this.attemptId = attempt.id;
        this.loadTestInfo();
      },
      error: (err) => console.error('Ошибка старта попытки', err)
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
      error: (err: any) => {
        console.error('Ошибка загрузки информации о тесте', err);
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
        console.log('Вопросы загружены:', data);
      },
      error: (err: any) => {
        console.error('Ошибка загрузки вопросов', err);
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

    this.testService.submitTest({
      testId: this.testId,
      answers: this.userAnswers
    }).subscribe({
      next: () => console.log('Прогресс сохранён'),
      error: (err) => console.error('Ошибка сохранения прогресса', err)
    });

    if (event) {
      event.returnValue = 'Вы точно хотите выйти? Прогресс будет сохранён';
    }
  }

  finishTest() {
    clearInterval(this.timer);

    this.testService.submitTest({
      testId: this.testId,
      answers: this.userAnswers
    }).subscribe({
      next: (res: any) => {
        console.log('Ответы сохранены', res);
        this.router.navigate(['/tests-page']);
      },
      error: (err: any) => console.error('Ошибка сохранения', err)
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
  }
}
