import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Question} from '../models/auth.model';
import {QuestionService} from '../services/question.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-test-start',
  templateUrl: './test-start.component.html',
  imports : [CommonModule]
})
export class TestStartComponent implements OnInit {

  questions: Question[] = [];
  testId!: number;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {
  }

  ngOnInit(): void {

    this.testId = Number(this.route.snapshot.paramMap.get('id'));

    this.questionService.getQuestionsByTest(this.testId)
      .subscribe(data => {
        this.questions = data;
      });
  }
}
