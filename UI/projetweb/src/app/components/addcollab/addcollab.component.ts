import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-addcollab',
  templateUrl: './addcollab.component.html',
  styleUrls: ['./addcollab.component.css']
})
export class AddcollabComponent implements OnInit {
  enteredUsername: string = '';
  userDetails: { name: string; surname: string } | null = null;
  collaborators: { name: string; surname: string }[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {}

  getUserDetails(): void {
    if (this.enteredUsername) {
      this.userService.getUserDetails(this.enteredUsername).subscribe(
        (userDetails) => {
          this.userDetails = userDetails;
        },
        (error) => {
          console.error('Error fetching user details:', error);
          this.userDetails = null;
        }
      );
    } else {
      this.userDetails = null;
    }
  }

  addCollaborator(): void {
    if (this.userDetails) {
      this.collaborators.push({
        name: this.userDetails.name,
        surname: this.userDetails.surname
      });

      this.enteredUsername = '';
      this.userDetails = null;
    }
  }
}
