import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * LoginComponent
 * A clean, centered login form that validates credentials
 * against the hardcoded test user.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // If already logged in, go straight to dashboard
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['/dashboard']);
    //   return;
    // }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Handle form submission.
   * Validates the form, calls AuthService, and handles the result.
   */
  onSubmit(): void {
    // Mark all fields as touched so validation messages show
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.getLogin(email, password ).subscribe({
      next: (data:any) => {
        console.log('Login success:', data);
        var res = data.body;
        this.isLoading = false;
        if (res.return_status==true) {
          console.log('Login successful, navigating to dashboard');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.return_message || 'Invalid email or password. Please try again.';
        }
      },
      error: (e) => {
        console.error('Login error:', e);
        var header = e.error.header;
        this.isLoading = false;
        this.errorMessage = header.return_message || 'Something went wrong. Please try again later.';
      }
    });
  }

  // Quick access to form controls for validation in the template
  get f() {
    return this.loginForm.controls;
  }
}
