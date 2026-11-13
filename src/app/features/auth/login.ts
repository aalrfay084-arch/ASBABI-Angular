
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';

  errorMessage = '';
  loading = false;
  passwordVisible = false;

  login(): void {

    if (this.loading) return;

    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'يرجى إدخال البريد الإلكتروني وكلمة المرور.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.authService.login({
      email: this.email.trim(),
      password: this.password
    })
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({

      
next: (response) => {

  console.log('Login successful:', response.message);

  const role = this.authService.getUserRole();

  if (role === 'Admin' || role === 'SuperAdmin') {
    this.router.navigate(['/admin']);
  } else {
    this.router.navigate(['/']);
  }

},


      error: (error) => {

        const response = error?.error;

        if (typeof response === 'string') {
          this.errorMessage = response;
        }
        else {
          this.errorMessage =
            response?.message ||
            response?.detail ||
            response?.title ||
            'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        }

        this.cdr.detectChanges();

      }

    });
  }
}
