import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Question} from '../models/auth.model';
import {QuestionService} from '../services/question.service';
import {CommonModule} from '@angular/common';
import {TestService} from '../services/test.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-test-start',
  templateUrl: './test-start.component.html',
  styleUrls: ['./test-start.component.css'],
  imports: [CommonModule]
})
export class TestStartComponent implements OnInit {

  questions: Question[] = [];
  testId!: number;


  remainingTime: number = 0;
  timer: any;

  constructor(
    private route: ActivatedRoute,
    // private questionService: QuestionService,
    private testService: TestService,
    private router: Router
  ) {}

  userAnswers: any = {};

  finishTest() {
    clearInterval(this.timer);

    const result = {
      testId: this.testId,
      answers: this.userAnswers
    };

    console.log(result);

    this.testService.submitTest(result).subscribe({
      next: (res: any) => {
        console.log("Ответы сохранены", res);
        this.router.navigate(['/tests-page']);
      },
      error: (err : any) => {
        console.error("Ошибка сохранения", err);
      }
    });
  }

  get formattedTime(): string {

    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

  ngOnInit(): void {
    this.testId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuestions();

    this.remainingTime = 30 * 60;
    this.startTimer();
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
