import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaskaddService {
  
  private apiUrl = 'http://localhost:3000/tasklist';

  addTask(task:any): Observable<any> {
    return this.http.post(this.apiUrl,task);
  }
  getAllTasks(): Observable<{  id: number,etat: string,titre: string, description: string ,proprietaire: string,date_fin: Date }[]> {
  return this.http.get<{  id: number,etat: string,titre: string, description: string ,proprietaire: string,date_fin: Date }[]>(this.apiUrl);
}
  constructor(private http: HttpClient) { }
}
