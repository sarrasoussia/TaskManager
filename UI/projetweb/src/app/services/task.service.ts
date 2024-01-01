import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../components/task/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(newTask: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, newTask);
  }

  updateTask(task: Task): Observable<Task> {
    const updateUrl = `${this.apiUrl}/${task.id}`; // Corrected URL
    return this.http.put<Task>(updateUrl, task);
  }

  updateTaskState(taskId: number, newState: string): Observable<any> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.put(url, { state: newState });
  }

  removeTask(taskId: number): Observable<any> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete(url);
  }
  



}
