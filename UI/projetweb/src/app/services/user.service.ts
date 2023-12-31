import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUserDetails(username: string): Observable<{ name: string; surname: string }> {
    const url = `${this.apiUrl}?username=${username}`;
    return this.http.get<{ name: string; surname: string }>(url);
  }
}
