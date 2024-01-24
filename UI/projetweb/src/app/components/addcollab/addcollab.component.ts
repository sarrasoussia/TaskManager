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
        // You can remove the unnecessary check below since it is handled in the service
        this.collaborators.push(this.enteredUsername);
      },
      (error) => {
        console.error('Error adding collaborator', error);
        if (error && error.error && error.error.message) {
          alert(error.error.message);
        }
      }
    );
  }

  clearCollaborators() {
    this.userService.clearCollaborators()
      .subscribe(response => {
        this.collaborators = response;
      }, error => {
        alert('Error clearing collaborators: ' + error.message);
      });
  }
  


}