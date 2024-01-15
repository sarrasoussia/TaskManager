import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AddcollaboratorService {
  private apiUrl = 'http://localhost:3000/collab';
  
  addCollab(passwordd: string, collabusername: string): Observable<any> {
    const requestBody = { passwordd: passwordd, collabusername: collabusername };
    return this.http.post(this.apiUrl, requestBody);
  }
  getcollabs(password:string): Observable<{username:string,name:string,surname:string,email:string,password:string,collaborators:string}[]>{
    const url = `${this.apiUrl}?password=${password}`;
    return this.http.get<{username:string,name:string,surname:string,email:string,password:string,collaborators:string}[]>(url);
  }

  constructor(private http: HttpClient) { }
}
