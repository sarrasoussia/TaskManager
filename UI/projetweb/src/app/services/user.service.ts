import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000';

  private collaboratorsSubject = new BehaviorSubject<string[]>([]);
  collaborators$: Observable<string[]> = this.collaboratorsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getActiveUserDetails(): Observable<{ username: string }> {
    const url = `${this.apiUrl}/activeUser`;
    return this.http.get<{ username: string }>(url);
  }

  clearActiveUser(): Observable<any> {
    const url = `${this.apiUrl}/logout`;
    return this.http.post(url, {});
  }



  addCollaborator(username: string): Observable<any> {
    return this.getActiveUserDetails().pipe(
      switchMap((activeUser) => {
        const activeUsername = activeUser.username;
        if (this.collaboratorsSubject.value.includes(username)) {
          alert('Error adding collaborator!');
          return; }
        const url = `${this.apiUrl}/addCollaborator`;
        const body = { username: activeUsername, collaborator: username };
        this.updateLocalCollaborators(username);
        return this.http.post(url, body);
      })
    );
  }
  

clearCollaborators(): Observable<string[]> {
  return this.getActiveUserDetails().pipe(
    switchMap(activeUser => {
      const url = `${this.apiUrl}/clearCollaborators`;
      const body = { username: activeUser.username };
      return this.http.post<string[]>(url, body).pipe();
    })
  );
}


getCollaborators(): Observable<string[]> {
  const url = `${this.apiUrl}/getCollaborators`;
  return this.http.get<string[]>(url);
}
  
 //update collaborators locally
 private updateLocalCollaborators(collaborator: string): void {
  const updatedCollaborators = [...this.collaboratorsSubject.value, collaborator];
  this.collaboratorsSubject.next(updatedCollaborators);
}

}