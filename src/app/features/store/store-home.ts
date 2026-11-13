
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-store-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './store-home.html',
  styleUrl: './store-home.css'
})
export class StoreHome implements OnInit {

  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];

  categories: Category[] = [];
selectedCategoryId: number | null = null;

  loading = true;
  errorMessage = '';

  searchText = '';

  isLoggedIn = false;

  get filteredBooks(): Book[] {
  const search = this.searchText.trim().toLowerCase();

  return this.books.filter(book => {
    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(search) ||
      book.author?.name?.toLowerCase().includes(search);

    const matchesCategory =
      this.selectedCategoryId === null ||
      book.categoryId === this.selectedCategoryId;

    return matchesSearch && matchesCategory;
  });
}

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
  }

  selectCategory(categoryId: number | null): void {
  this.selectedCategoryId = categoryId;
  this.cdr.detectChanges();
}

  logout(): void {
    this.authService.logout();

    this.isLoggedIn = false;

    this.router.navigateByUrl('/');
  }

  ngOnInit(): void {

    if (typeof localStorage !== 'undefined') {
      this.isLoggedIn = this.authService.isLoggedIn();
    }

    this.categoryService.getCategories().subscribe({
  next: (data) => {
    this.categories = data;
    this.cdr.detectChanges();
  },
  error: (error) => {
    console.error('Error loading categories:', error);
  }
});

    this.bookService.getBooks().subscribe({

      next: (data) => {
        this.books = data;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading books:', error);
        this.errorMessage = 'تعذر تحميل الكتب، يرجى المحاولة مرة أخرى.';
        this.loading = false;
        this.cdr.detectChanges();
      }

    });
  }

}
