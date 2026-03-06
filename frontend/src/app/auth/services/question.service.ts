import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Question, Test} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  private apiUrl = 'http://localhost:8080/start-test';

  constructor(private http: HttpClient) {
  }

  getQuestionsByTest(testId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${testId}`);
  }
}
