import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Purchase } from '../../core/models/purchase';
import { PurchaseService } from '../../core/services/purchase.service';

@Component({
  selector: 'app-my-purchases',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-purchases.html',
  styleUrl: './my-purchases.css'
})
export class MyPurchases implements OnInit {

  private purchaseService = inject(PurchaseService);
  private cdr = inject(ChangeDetectorRef);

  purchases: Purchase[] = [];

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.loading = true;
    this.errorMessage = '';

    this.purchaseService.getMyPurchases().subscribe({

      next: (data) => {
        this.purchases = data;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading purchases:', error);

        this.errorMessage =
          'تعذر تحميل طلبات الشراء. يرجى المحاولة مرة أخرى.';

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

      case 'completed':
        return 'مكتمل';

      case 'expired':
        return 'انتهت المهلة';

      default:
        return status;
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status?.toLowerCase()) {

      case 'paid':
        return 'مدفوع';

      case 'unpaid':
        return 'غير مدفوع';

      default:
        return status;
    }
  }
}
