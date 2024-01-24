// comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Comment } from '../components/task/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/comments';
  private currentUser: string | null = null;

  constructor(private http: HttpClient) {}

  getCommentsByTaskId(taskId: number): Observable<Comment[]> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.get<Comment[]>(url);
  }

  login(username: string, password: string): Observable<boolean> {
    // Here you might call an authentication service or API
    // For simplicity, let's assume a successful login with any username
    this.currentUser = username;
    return of(true);
  }

  // Simulate logout
  logout(): void {
    this.currentUser = null;
  }

  // Get the current username
  getCurrentUsername(): string | null {
    return this.currentUser;
  }

  addComment(comment: Comment): Observable<any> {
    const currentUsername = this.getCurrentUsername();

    if (currentUsername) {
      comment.owner = currentUsername; // Set the owner before sending the request
      return this.http.post(`${this.apiUrl}`, comment);
    } else {
      // Handle the case where the user is not authenticated
      return new Observable(); // You might want to return an observable with an error or handle it differently
    }
  }
  
}
