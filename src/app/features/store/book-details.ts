import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { BookService } from '../../core/services/book.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { AuthService } from '../../core/services/auth.service';

import { Book } from '../../core/models/book';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private bookService = inject(BookService);
  private borrowingService = inject(BorrowingService);
  private purchaseService = inject(PurchaseService);
  private authService = inject(AuthService);

  private cdr = inject(ChangeDetectorRef);

  book?: Book;

  loading = true;
  errorMessage = '';

  // Borrowing
  borrowingLoading = false;
  borrowingSuccess = '';
  borrowingError = '';

  // Purchase
  purchaseLoading = false;
  purchaseSuccess = '';
  purchaseError = '';
  purchaseQuantity = 1;


  // Borrow Book
  borrowBook(): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }

    if (!this.book || this.borrowingLoading) {
      return;
    }

    this.borrowingError = '';
    this.borrowingSuccess = '';

    this.borrowingLoading = true;
    this.cdr.detectChanges();

    this.borrowingService.createBorrowing(this.book.bookId)
      .pipe(
        finalize(() => {
          this.borrowingLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: () => {
          this.borrowingSuccess =
            'تم إرسال طلب الاستعارة بنجاح، وهو الآن بانتظار موافقة الإدارة.';

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Borrowing error:', error);

          const response = error?.error;

          this.borrowingError =
            typeof response === 'string'
              ? response
              : response?.message ||
                response?.detail ||
                response?.title ||
                'تعذر إرسال طلب الاستعارة. يرجى المحاولة مرة أخرى.';

          this.cdr.detectChanges();
        }

      });
  }


  // Buy Book
  buyBook(): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }

    if (!this.book || this.purchaseLoading) {
      return;
    }

    if (
      this.purchaseQuantity < 1 ||
      this.purchaseQuantity > this.book.quantity
    ) {
      this.purchaseError = 'الكمية المطلوبة غير متاحة.';
      return;
    }

    this.purchaseError = '';
    this.purchaseSuccess = '';

    this.purchaseLoading = true;
    this.cdr.detectChanges();

    this.purchaseService.createPurchase({
      bookId: this.book.bookId,
      quantity: this.purchaseQuantity
    })
      .pipe(
        finalize(() => {
          this.purchaseLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: () => {
          this.purchaseSuccess =
            'تم إرسال طلب الشراء بنجاح، وهو الآن بانتظار موافقة الإدارة.';

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Purchase error:', error);

          const response = error?.error;

          this.purchaseError =
            typeof response === 'string'
              ? response
              : response?.message ||
                response?.detail ||
                response?.title ||
                'تعذر إرسال طلب الشراء. يرجى المحاولة مرة أخرى.';

          this.cdr.detectChanges();
        }

      });
  }


  // Load Book Details
  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.bookService.getBooks().subscribe({

      next: (books) => {
        this.book = books.find(b => b.bookId === id);

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading book details:', error);

        this.errorMessage = 'تعذر تحميل بيانات الكتاب.';

        this.loading = false;
        this.cdr.detectChanges();
      }

    });
  }

}