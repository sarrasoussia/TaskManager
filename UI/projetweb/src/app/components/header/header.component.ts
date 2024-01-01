import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userDetails: { username: string } | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getActiveUserDetails().subscribe(
      (data) => {
        this.userDetails = data;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  logout(): void {
    this.userService.clearActiveUser().subscribe(
      () => {
        this.router.navigate(['']); 
      },
    );
  }

}
