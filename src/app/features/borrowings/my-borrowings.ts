
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import {
  Borrowing,
  BorrowingService
} from '../../core/services/borrowing.service';

@Component({
  selector: 'app-my-borrowings',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-borrowings.html',
  styleUrl: './my-borrowings.css'
})
export class MyBorrowings implements OnInit {

  private borrowingService = inject(BorrowingService);
  private cdr = inject(ChangeDetectorRef);

  borrowings: Borrowing[] = [];

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadBorrowings();
  }

  loadBorrowings(): void {
    this.loading = true;
    this.errorMessage = '';

    this.borrowingService.getMyBorrowings().subscribe({

      next: (data) => {
        this.borrowings = data;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading borrowings:', error);

        this.errorMessage =
          'تعذر تحميل طلبات الاستعارة. يرجى المحاولة مرة أخرى.';

        this.loading = false;
        this.cdr.detectChanges();
      }

    });
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'قيد الانتظار';

      case 'approved':
        return 'تمت الموافقة';

      case 'rejected':
        return 'مرفوض';

      case 'returned':
        return 'تمت الإعادة';

      case 'overdue':
        return 'متأخر';

      case 'cancelled':
        return 'ملغي';

      default:
        return status;
    }
  }
}
