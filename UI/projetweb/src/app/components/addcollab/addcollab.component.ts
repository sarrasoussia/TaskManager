import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-addcollab',
  templateUrl: './addcollab.component.html',
  styleUrls: ['./addcollab.component.css']
})
export class AddcollabComponent implements OnInit {
  
  enteredUsername: string = '';  
  collaborators: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
      this.userService.getCollaborators().subscribe(
        (collaborators) => {
          this.collaborators = collaborators;
        },
        (error) => {
          console.error('Error fetching collaborators', error);
        }
      );
  }
  
  addCollaborator(): void {
    this.userService.addCollaborator(this.enteredUsername).subscribe(
      (response) => {
        console.log('Collaborator added successfully', response);
        
        if (this.collaborators.indexOf(this.enteredUsername) === -1) {
          this.collaborators.push(this.enteredUsername);
        } else {
          console.warn('Collaborator already exists locally');
        }
      },
      (error) => {
        console.error('Error adding collaborator', error);
        if (error && error.error && error.error.message) {
          alert(error.error.message);
        }
      }
    );
  }
  


}
