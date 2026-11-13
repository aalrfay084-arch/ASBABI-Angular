
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';
  loading = false;

  passwordVisible = false;

  register(): void {
    if (this.loading) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.fullName.trim() || !this.email.trim() ||
        !this.password || !this.confirmPassword) {
      this.errorMessage = 'يرجى تعبئة جميع الحقول.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'كلمتا المرور غير متطابقتين.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'كلمة المرور يجب ألا تقل عن 6 أحرف.';
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.authService.register({
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      password: this.password,
      confirmPassword: this.confirmPassword
    })
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: () => {
        this.successMessage = 'تم إنشاء حسابك بنجاح! سيتم تحويلك إلى صفحة تسجيل الدخول.';
        this.cdr.detectChanges();

        setTimeout(() => {
  this.router.navigateByUrl('/login', {
    state: { registrationSuccess: true }
  }).then((navigated) => {
    if (!navigated) {
      window.location.assign('/login');
    }
  }).catch(() => {
    window.location.assign('/login');
  });
}, 1500);
      },

      error: (error) => {
        this.errorMessage = this.translateErrors(error);
        this.cdr.detectChanges();
      }
    });
  }

  private translateErrors(error: any): string {
    const response = error?.error;
    const messages: string[] = [];

    if (response?.errors) {
      for (const key of Object.keys(response.errors)) {
        const fieldErrors = response.errors[key];

        for (const item of fieldErrors) {
          const message =
            typeof item === 'string'
              ? item
              : item.description || item.code || '';

          messages.push(this.translateMessage(message));
        }
      }
    }

    if (messages.length > 0) {
      return [...new Set(messages)].join('\n');
    }

    if (typeof response === 'string') {
      return this.translateMessage(response);
    }

    return this.translateMessage(
      response?.detail ||
      response?.title ||
      response?.message ||
      'تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى.'
    );
  }

  private translateMessage(message: string): string {
    const text = (message || '').toLowerCase();

    if (text.includes('passwordrequiresnonalphanumeric')) {
      return 'كلمة المرور يجب أن تحتوي على رمز خاص مثل @ أو # أو !.';
    }

    if (text.includes('passwordrequiresdigit')) {
      return 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.';
    }

    if (text.includes('passwordrequiresupper')) {
      return 'كلمة المرور يجب أن تحتوي على حرف إنجليزي كبير مثل A أو B.';
    }

    if (text.includes('passwordrequireslower')) {
      return 'كلمة المرور يجب أن تحتوي على حرف إنجليزي صغير مثل a أو b.';
    }

    if (text.includes('passwordtooshort')) {
      return 'كلمة المرور قصيرة جدًا.';
    }

    if (text.includes('duplicateusername') ||
        text.includes('duplicateemail')) {
      return 'هذا البريد الإلكتروني مسجل مسبقًا. استخدم بريدًا آخر.';
    }

    if (text.includes('invalidemail')) {
      return 'صيغة البريد الإلكتروني غير صحيحة.';
    }

    return message || 'حدث خطأ غير متوقع.';
  }
}
