import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../components/task/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  private url = 'http://localhost:3000/';


  constructor(private http: HttpClient) {}

  getActiveUserDetails(): Observable<{ username: string }> {
    const url = `${this.url}/activeUser`;
    return this.http.get<{ username: string }>(url);
  }

  addTask(newTask: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, newTask);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>( this.apiUrl );
  }

  getTaskById(taskId: number): Observable<Task> {
    const taskUrl = `${this.apiUrl}/${taskId}`;
    return this.http.get<Task>(taskUrl);
  }

  updateTask(task: Task): Observable<Task> {
    const updateUrl = `${this.apiUrl}/${task.id}`; 
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
  

  //ll comment 

  // getTask(taskId: number): Observable<Task> {
  //   const url = `${this.apiUrl}/${taskId}`;
  //   return this.http.get<Task>(url).pipe(
  //     tap(task => console.log('Fetched task:', task)),
  //     catchError(error => {
  //       console.error('Error fetching task:', error);
  //       throw error;
  //     })
  //   );
  // }
  


}
