import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../services/test.service';
import { TestResult } from '../models/auth.model';
import { NgIf, NgFor } from '@angular/common'; // <-- правильно
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  standalone: true,
  imports: [NgIf, NgFor]
})
export class ResultComponent implements OnInit {
  result: TestResult | null = null;
  loading = true;
  error = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router
  ) {}

  ngOnInit() {
    const attemptId = Number(this.route.snapshot.params['id']);
    console.log('Loading result for attempt ID:', attemptId);

    if (!attemptId || isNaN(attemptId)) {
      console.error('Invalid attempt ID');
      this.error = true;
      this.errorMessage = 'Неверный ID попытки';
      this.loading = false;
      return;
    }

    this.testService.getResult(attemptId).subscribe({
      next: (res) => {
        console.log('RESULT received:', res);
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading result:', err);
        this.error = true;
        this.loading = false;
        this.errorMessage = err.error?.error || err.message || 'Ошибка загрузки результатов';
      }
    });
  }

  getAnswerText(question: any): string {
    if (!question.userAnswer) return 'Нет ответа';
    if (Array.isArray(question.userAnswer)) return question.userAnswer.join(', ') || 'Нет ответа';
    return String(question.userAnswer);
  }

  getCorrectAnswersText(question: any): string {
    if (!question.correctAnswers) return 'Нет данных';
    if (Array.isArray(question.correctAnswers)) return question.correctAnswers.join(', ') || 'Нет данных';
    return String(question.correctAnswers);
  }
}
