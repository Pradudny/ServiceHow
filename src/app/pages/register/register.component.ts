import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, RegistrationRequest } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: RegistrationRequest = {
    userFname: '',
    userLname: '',
    department: '',
    birthDate: '',
    address: '',
    email: '',
    password: '',
    phoneNumber: '',
    createdBy: '',
    createdDate: ''
  };

  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private userService: UserService, private router: Router) {}

  registerUser(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    this.userService.registerUser(this.registerForm).subscribe({
      next: () => {
        this.successMessage = 'Registration completed successfully.';
        this.isSubmitting = false;
        this.registerForm = {
          userFname: '',
          userLname: '',
          department: '',
          birthDate: '',
          address: '',
          email: '',
          password: '',
          phoneNumber: '',
          createdBy: '',
          createdDate: ''
        };
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
