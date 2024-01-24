import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AddcollaboratorService {
  private apiUrl = 'http://localhost:3000/collab';
  private apiUrl1 = 'http://localhost:3000/activeUser';

  getActiveUserDetails(): Observable<{ username: string }> {
    const url = this.apiUrl1;
    return this.http.get<{ username: string }>(url);
  }
  
  addCollab(collabusername: string): Observable<any> {
    const requestBody = {collabusername: collabusername };
    return this.http.post(this.apiUrl, requestBody);
  }
  deleteCollab(collabusername: string): Observable<any> {
    const options = {
      body: { collabusername: collabusername } 
    };
    return this.http.request('delete', this.apiUrl, options);
  }
  
  getcollabs(username:string): Observable<{username:string,name:string,surname:string,email:string,password:string,collaborators:string}[]>{
    const url = `${this.apiUrl}?username=${username}`;
    return this.http.get<{username:string,name:string,surname:string,email:string,password:string,collaborators:string}[]>(url);
  }

  constructor(private http: HttpClient) { }
}