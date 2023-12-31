import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SignupService {
  private apiUrl = 'http://localhost:3000/signup';

  constructor(private http: HttpClient) {}

  signUp(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}