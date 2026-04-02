import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Test, Question, TestResult} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({Authorization: `Bearer ${token}`});
  }

  getAllTests(): Observable<Test[]> {
    return this.http.get<Test[]>(`${this.apiUrl}/tests-page`, {headers: this.getAuthHeaders()});
  }

  startTest(testId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/attempt/start/${testId}`, {}, {headers: this.getAuthHeaders()});
  }

  getQuestions(testId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/start-test/${testId}`, {headers: this.getAuthHeaders()});
  }

  submitTest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/attempt/submit`, data, {headers: this.getAuthHeaders()});
  }

  getTestById(testId: number): Observable<Test> {
    return this.http.get<Test>(`${this.apiUrl}/tests/${testId}`, {headers: this.getAuthHeaders()});
  }

  saveProgress(attemptId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/attempt/save-progress/${attemptId}`, data, {headers: this.getAuthHeaders()});
  }

  getResult(attemptId: number) {
    return this.http.get<TestResult>(
      `${this.apiUrl}/attempt/result/${attemptId}`, {headers: this.getAuthHeaders()}
    );
  }
}
