import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskaddService {
  
  private apiUrl = 'http://localhost:3000/tasklist';
  private apiUrl1 = 'http://localhost:3000/activeUser';

  getActiveUserDetails(): Observable<{ username: string }> {
    const url = this.apiUrl1;
    return this.http.get<{ username: string }>(url);
  }

  addTask(task:any): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  getAllTasks(username: string): Observable<{ id: number, etat: string, titre: string, description: string, proprietaire: string, date_fin: Date }[]> {
    const url = `${this.apiUrl}?username=${username}`;
    return this.http.get<{ id: number, etat: string, titre: string, description: string, proprietaire: string, date_fin: Date }[]>(url);
  }

  constructor(private http: HttpClient) { }
}