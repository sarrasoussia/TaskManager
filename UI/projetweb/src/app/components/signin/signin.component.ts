import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  email = '';
  password = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const formData = {
      email: this.email,
      password: this.password,
    };

    this.http.post<any>('http://localhost:3000/signin', formData).subscribe(
      (response) => {
        console.log(response);
        this.successMessage = 'Sign in successful!';
        this.errorMessage = null;

        if (response.success && response.userDetails) {
          this.router.navigate(['/container']);
        }
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Invalid email or password. Please try again.';
        this.successMessage = null;
      }
    );
  }
}
