import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Test} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = 'http://localhost:8080/tests-page';

  constructor(private http: HttpClient) {
  }

  getAllTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.apiUrl);
  }
}
