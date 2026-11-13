
import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  BorrowingService,
  Borrowing
} from '../../../core/services/borrowing.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  PurchaseService
} from '../../../core/services/purchase.service';

import {
  Purchase
} from '../../../core/models/purchase';

import { AuthService } from '../../../core/services/auth.service';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { CategoryService } from '../../../core/services/category.service';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user';
import { Book } from '../../../core/models/book';
import { Author } from '../../../core/models/author';
import { Category } from '../../../core/models/category';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private categoryService = inject(CategoryService);
  private borrowingService = inject(BorrowingService);
  private purchaseService = inject(PurchaseService);
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  role = this.authService.getUserRole();

  activeSection: string = '';

  // Books
  books: Book[] = [];
  loadingBooks = false;
  showBookForm = false;
  isEditMode = false;

  bookForm = {
    bookId: 0,
    title: '',
    price: 0,
    quantity: 0,
    authorId: 0,
    categoryId: 0
  };

  // Authors
  authors: Author[] = [];
  loadingAuthors = false;
  showAuthorForm = false;
  isEditAuthorMode = false;

  authorForm = {
    authorId: 0,
    name: '',
    biography: ''
  };
    // Categories Management

loadingCategories = false;
showCategoryForm = false;
isEditCategoryMode = false;

categoryMessage = '';
categoryErrorMessage = '';

categoryForm = {
  categoryId: 0,
  name: '',
  description: ''
};

// Borrowings Management
borrowings: Borrowing[] = [];
loadingBorrowings = false;
borrowingMessage = '';
borrowingErrorMessage = '';

// Purchases Management
purchases: Purchase[] = [];
loadingPurchases = false;
purchaseMessage = '';
purchaseErrorMessage = '';


// Admins Management
admins: User[] = [];
loadingAdmins = false;
adminMessage = '';
adminErrorMessage = '';

showAdminForm = false;

adminForm = {
  fullName: '',
  email: '',
  password: ''
};

    // Users Management
users: User[] = [];
loadingUsers = false;
userMessage = '';
userErrorMessage = '';

  // Categories
  categories: Category[] = [];

  // Messages
  message = '';
  errorMessage = '';

  authorMessage = '';
  authorErrorMessage = '';

  ngOnInit(): void {
    this.loadAuthors();
    this.loadCategories();
  }

  openSection(section: string): void {
    this.activeSection = section;

    if (section === 'books') {
      this.message = '';
      this.errorMessage = '';
      this.loadBooks();
    }

    if (section === 'authors') {
      this.authorMessage = '';
      this.authorErrorMessage = '';
      this.loadAuthors();
    }

    if (section === 'categories') {
  this.categoryMessage = '';
  this.categoryErrorMessage = '';
  this.loadCategories();
}

    if (section === 'borrowings') {
  this.borrowingMessage = '';
  this.borrowingErrorMessage = '';
  this.loadBorrowings();
}

    if (section === 'purchases') {
  this.purchaseMessage = '';
  this.purchaseErrorMessage = '';
  this.loadPurchases();
}

    if (section === 'admins' && this.role === 'SuperAdmin') {
  this.adminMessage = '';
  this.adminErrorMessage = '';
  this.loadAdmins();
}

    if (section === 'users') {
  this.userMessage = '';
  this.userErrorMessage = '';
  this.loadUsers();
}

    this.cdr.detectChanges();
  }

  // =========================
  // Books Management
  // =========================

  loadBooks(): void {
    this.loadingBooks = true;
    this.errorMessage = '';

    this.cdr.detectChanges();

    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.loadingBooks = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Books loading error:', error);

        this.errorMessage = 'تعذر تحميل الكتب.';
        this.loadingBooks = false;

        this.cdr.detectChanges();
      }
    });
  }

  openAddBookForm(): void {
    this.isEditMode = false;

    this.bookForm = {
      bookId: 0,
      title: '',
      price: 0,
      quantity: 0,
      authorId: 0,
      categoryId: 0
    };

    this.message = '';
    this.errorMessage = '';
    this.showBookForm = true;

    this.cdr.detectChanges();
  }

  openEditBookForm(book: Book): void {
    this.isEditMode = true;

    this.bookForm = {
      bookId: book.bookId,
      title: book.title,
      price: book.price,
      quantity: book.quantity,
      authorId: book.authorId,
      categoryId: book.categoryId
    };

    this.message = '';
    this.errorMessage = '';
    this.showBookForm = true;

    this.cdr.detectChanges();
  }

  closeBookForm(): void {
    this.showBookForm = false;
    this.cdr.detectChanges();
  }

  saveBook(): void {
    this.message = '';
    this.errorMessage = '';

    const bookData = {
      title: this.bookForm.title.trim(),
      price: Number(this.bookForm.price),
      quantity: Number(this.bookForm.quantity),
      authorId: Number(this.bookForm.authorId),
      categoryId: Number(this.bookForm.categoryId)
    };

    if (
      !bookData.title ||
      bookData.price < 0 ||
      bookData.quantity < 0 ||
      !bookData.authorId ||
      !bookData.categoryId
    ) {
      this.errorMessage = 'يرجى إدخال جميع بيانات الكتاب بشكل صحيح.';
      this.cdr.detectChanges();
      return;
    }

    if (this.isEditMode) {
      this.bookService.updateBook(
        this.bookForm.bookId,
        bookData
      ).subscribe({
        next: () => {
          this.message = 'تم تعديل الكتاب بنجاح.';
          this.showBookForm = false;
          this.loadBooks();
        },
        error: (error) => {
          console.error('Update book error:', error);
          this.errorMessage = 'حدث خطأ أثناء تعديل الكتاب.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.bookService.addBook(bookData).subscribe({
        next: () => {
          this.message = 'تمت إضافة الكتاب بنجاح.';
          this.showBookForm = false;
          this.loadBooks();
        },
        error: (error) => {
          console.error('Add book error:', error);
          this.errorMessage = 'حدث خطأ أثناء إضافة الكتاب.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteBook(id: number): void {
    const confirmed = confirm('هل أنت متأكد من حذف هذا الكتاب؟');

    if (!confirmed) {
      return;
    }

    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.message = 'تم حذف الكتاب بنجاح.';
        this.errorMessage = '';
        this.loadBooks();
      },
      error: (error) => {
        console.error('Delete book error:', error);
        this.errorMessage = 'تعذر حذف الكتاب.';
        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // Authors Management
  // =========================

  loadAuthors(): void {
    this.loadingAuthors = true;
    this.authorErrorMessage = '';

    this.cdr.detectChanges();

    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        this.loadingAuthors = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Authors loading error:', error);

        this.authorErrorMessage = 'تعذر تحميل المؤلفين.';
        this.loadingAuthors = false;

        this.cdr.detectChanges();
      }
    });
  }

  openAddAuthorForm(): void {
    this.isEditAuthorMode = false;

    this.authorForm = {
      authorId: 0,
      name: '',
      biography: ''
    };

    this.authorMessage = '';
    this.authorErrorMessage = '';
    this.showAuthorForm = true;

    this.cdr.detectChanges();
  }

  openEditAuthorForm(author: Author): void {
    this.isEditAuthorMode = true;

    this.authorForm = {
      authorId: author.authorId,
      name: author.name,
      biography: author.biography || ''
    };

    this.authorMessage = '';
    this.authorErrorMessage = '';
    this.showAuthorForm = true;

    this.cdr.detectChanges();
  }

  closeAuthorForm(): void {
    this.showAuthorForm = false;
    this.cdr.detectChanges();
  }

  saveAuthor(): void {
    this.authorMessage = '';
    this.authorErrorMessage = '';

    const authorData = {
      name: this.authorForm.name.trim(),
      biography: this.authorForm.biography.trim()
    };

    if (!authorData.name) {
      this.authorErrorMessage = 'يرجى إدخال اسم المؤلف.';
      this.cdr.detectChanges();
      return;
    }

    if (this.isEditAuthorMode) {
      this.authorService.updateAuthor(
        this.authorForm.authorId,
        authorData
      ).subscribe({
        next: () => {
          this.authorMessage = 'تم تعديل المؤلف بنجاح.';
          this.showAuthorForm = false;
          this.loadAuthors();
        },
        error: (error) => {
          console.error('Update author error:', error);

          this.authorErrorMessage = 'حدث خطأ أثناء تعديل المؤلف.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.authorService.addAuthor(authorData).subscribe({
        next: () => {
          this.authorMessage = 'تمت إضافة المؤلف بنجاح.';
          this.showAuthorForm = false;
          this.loadAuthors();
        },
        error: (error) => {
          console.error('Add author error:', error);

          this.authorErrorMessage = 'حدث خطأ أثناء إضافة المؤلف.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteAuthor(id: number): void {
    const confirmed = confirm('هل أنت متأكد من حذف هذا المؤلف؟');

    if (!confirmed) {
      return;
    }

    this.authorService.deleteAuthor(id).subscribe({
      next: () => {
        this.authorMessage = 'تم حذف المؤلف بنجاح.';
        this.authorErrorMessage = '';
        this.loadAuthors();
      },
      error: (error) => {
        console.error('Delete author error:', error);

        this.authorErrorMessage = 'تعذر حذف المؤلف.';
        this.cdr.detectChanges();
      }
    });
  }

  // =========================
  // Categories
  // =========================

loadCategories(): void {
  this.loadingCategories = true;
  this.categoryErrorMessage = '';
  this.cdr.detectChanges();

  this.categoryService.getCategories().subscribe({
    next: (data) => {
      this.categories = data;
      this.loadingCategories = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Categories loading error:', error);
      this.categoryErrorMessage = 'تعذر تحميل التصنيفات.';
      this.loadingCategories = false;
      this.cdr.detectChanges();
    }
  });
}

openAddCategoryForm(): void {
  this.isEditCategoryMode = false;

  this.categoryForm = {
    categoryId: 0,
    name: '',
    description: ''
  };

  this.categoryMessage = '';
  this.categoryErrorMessage = '';
  this.showCategoryForm = true;
}

openEditCategoryForm(category: Category): void {
  this.isEditCategoryMode = true;

  this.categoryForm = {
    categoryId: category.categoryId,
    name: category.name,
    description: category.description || ''
  };

  this.categoryMessage = '';
  this.categoryErrorMessage = '';
  this.showCategoryForm = true;
}

closeCategoryForm(): void {
  this.showCategoryForm = false;
}

saveCategory(): void {
  this.categoryMessage = '';
  this.categoryErrorMessage = '';

  const categoryData = {
    name: this.categoryForm.name.trim(),
    description: this.categoryForm.description.trim()
  };

  if (!categoryData.name) {
    this.categoryErrorMessage = 'يرجى إدخال اسم التصنيف.';
    this.cdr.detectChanges();
    return;
  }

  if (this.isEditCategoryMode) {
    this.categoryService.updateCategory(
      this.categoryForm.categoryId,
      categoryData
    ).subscribe({
      next: () => {
        this.categoryMessage = 'تم تعديل التصنيف بنجاح.';
        this.showCategoryForm = false;
        this.loadCategories();
      },
      error: (error) => {
        console.error('Update category error:', error);
        this.categoryErrorMessage = 'حدث خطأ أثناء تعديل التصنيف.';
        this.cdr.detectChanges();
      }
    });
  } else {
    this.categoryService.addCategory(categoryData).subscribe({
      next: () => {
        this.categoryMessage = 'تمت إضافة التصنيف بنجاح.';
        this.showCategoryForm = false;
        this.loadCategories();
      },
      error: (error) => {
        console.error('Add category error:', error);
        this.categoryErrorMessage = 'حدث خطأ أثناء إضافة التصنيف.';
        this.cdr.detectChanges();
      }
    });
  }
}

deleteCategory(id: number): void {
  const confirmed = confirm('هل أنت متأكد من حذف هذا التصنيف؟');

  if (!confirmed) {
    return;
  }

  this.categoryService.deleteCategory(id).subscribe({
    next: () => {
      this.categoryMessage = 'تم حذف التصنيف بنجاح.';
      this.categoryErrorMessage = '';
      this.loadCategories();
    },
    error: (error) => {
      console.error('Delete category error:', error);
      this.categoryErrorMessage = 'تعذر حذف التصنيف.';
      this.cdr.detectChanges();
    }
  });
}


    loadBorrowings(): void {
  this.loadingBorrowings = true;
  this.borrowingErrorMessage = '';

  this.cdr.detectChanges();

  this.borrowingService.getAllBorrowings().subscribe({
    next: (data) => {
      this.borrowings = data;
      this.loadingBorrowings = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Borrowings loading error:', error);

      this.borrowingErrorMessage = 'تعذر تحميل طلبات الاستعارة.';
      this.loadingBorrowings = false;

      this.cdr.detectChanges();
    }
  });
}



    updateBorrowingStatus(id: number, status: string): void {
  this.borrowingMessage = '';
  this.borrowingErrorMessage = '';

  this.borrowingService.updateBorrowingStatus(id, status).subscribe({
    next: () => {
      this.borrowingMessage = 'تم تحديث حالة طلب الاستعارة بنجاح.';
      this.loadBorrowings();
    },
    error: (error) => {
      console.error('Update borrowing error:', error);

      this.borrowingErrorMessage =
        error.error?.message || 'تعذر تحديث حالة طلب الاستعارة.';

      this.cdr.detectChanges();
    }
  });
}

    deleteBorrowing(id: number): void {
  const confirmed = confirm('هل أنت متأكد من حذف طلب الاستعارة؟');

  if (!confirmed) {
    return;
  }

  this.borrowingService.deleteBorrowing(id).subscribe({
    next: () => {
      this.borrowingMessage = 'تم حذف طلب الاستعارة بنجاح.';
      this.borrowingErrorMessage = '';
      this.loadBorrowings();
    },
    error: (error) => {
      console.error('Delete borrowing error:', error);

      this.borrowingErrorMessage =
        error.error?.message || 'تعذر حذف طلب الاستعارة.';

      this.cdr.detectChanges();
    }
  });
}


    payLateFee(id: number): void {
  const confirmed = confirm('هل تؤكد تسجيل دفع الغرامة؟');

  if (!confirmed) {
    return;
  }

  this.borrowingService.payLateFee(id).subscribe({
    next: () => {
      this.borrowingMessage = 'تم تسجيل دفع الغرامة بنجاح.';
      this.borrowingErrorMessage = '';
      this.loadBorrowings();
    },
    error: (error) => {
      console.error('Pay late fee error:', error);

      this.borrowingErrorMessage =
        error.error?.message || 'تعذر تسجيل دفع الغرامة.';

      this.cdr.detectChanges();
    }
  });
}


loadPurchases(): void {
  this.loadingPurchases = true;
  this.purchaseErrorMessage = '';

  this.cdr.detectChanges();

  this.purchaseService.getAllPurchases().subscribe({
    next: (data) => {
      this.purchases = data;
      this.loadingPurchases = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Purchases loading error:', error);

      this.purchaseErrorMessage = 'تعذر تحميل طلبات الشراء.';
      this.loadingPurchases = false;

      this.cdr.detectChanges();
    }
  });
}

    updatePurchaseStatus(id: number, status: string): void {
  this.purchaseMessage = '';
  this.purchaseErrorMessage = '';

  this.purchaseService.updatePurchaseStatus(id, status).subscribe({
    next: () => {
      this.purchaseMessage = 'تم تحديث حالة طلب الشراء بنجاح.';
      this.loadPurchases();
    },
    error: (error) => {
      console.error('Update purchase error:', error);

      this.purchaseErrorMessage =
        error.error?.message ||
        error.error ||
        'تعذر تحديث حالة طلب الشراء.';

      this.cdr.detectChanges();
    }
  });
}

    deletePurchase(id: number): void {
  const confirmed = confirm('هل أنت متأكد من حذف طلب الشراء؟');

  if (!confirmed) {
    return;
  }

  this.purchaseService.deletePurchase(id).subscribe({
    next: () => {
      this.purchaseMessage = 'تم حذف طلب الشراء بنجاح.';
      this.purchaseErrorMessage = '';
      this.loadPurchases();
    },
    error: (error) => {
      console.error('Delete purchase error:', error);

      this.purchaseErrorMessage =
        error.error?.message ||
        error.error ||
        'تعذر حذف طلب الشراء.';

      this.cdr.detectChanges();
    }
  });
}


    // =========================
// Admins Management
// =========================

loadAdmins(): void {
  this.loadingAdmins = true;
  this.adminErrorMessage = '';

  this.cdr.detectChanges();

  this.adminService.getAdmins().subscribe({
    next: (data) => {
      this.admins = data;
      this.loadingAdmins = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Admins loading error:', error);

      this.adminErrorMessage = 'تعذر تحميل المسؤولين.';
      this.loadingAdmins = false;

      this.cdr.detectChanges();
    }
  });
}

    openAddAdminForm(): void {
  this.adminForm = {
    fullName: '',
    email: '',
    password: ''
  };

  this.adminMessage = '';
  this.adminErrorMessage = '';
  this.showAdminForm = true;
}

closeAdminForm(): void {
  this.showAdminForm = false;
}

createAdmin(): void {
  if (
    !this.adminForm.fullName.trim() ||
    !this.adminForm.email.trim() ||
    !this.adminForm.password
  ) {
    this.adminErrorMessage = 'يرجى تعبئة جميع الحقول.';
    return;
  }

  if (this.adminForm.password.length < 6) {
    this.adminErrorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.';
    return;
  }

  const data = {
    fullName: this.adminForm.fullName.trim(),
    email: this.adminForm.email.trim(),
    password: this.adminForm.password
  };

  this.adminService.createAdmin(data).subscribe({
    next: () => {
      this.adminMessage = 'تم إنشاء حساب المسؤول بنجاح.';
      this.adminErrorMessage = '';
      this.closeAdminForm();
      this.loadAdmins();
    },
    error: (error) => {
      console.error('Create admin error:', error);

      this.adminErrorMessage =
        typeof error.error === 'string'
          ? error.error
          : error.error?.message || 'تعذر إنشاء حساب المسؤول.';

      this.cdr.detectChanges();
    }
  });
}

deleteAdmin(id: string): void {
  if (!confirm('هل أنت متأكد من حذف هذا المسؤول؟')) {
    return;
  }

  this.adminService.deleteAdmin(id).subscribe({
    next: () => {
      this.adminMessage = 'تم حذف المسؤول بنجاح.';
      this.adminErrorMessage = '';
      this.loadAdmins();
    },
    error: (error) => {
      console.error('Delete admin error:', error);

      this.adminErrorMessage =
        typeof error.error === 'string'
          ? error.error
          : error.error?.message || 'تعذر حذف المسؤول.';

      this.cdr.detectChanges();
    }
  });
}

    loadUsers(): void {
  this.loadingUsers = true;
  this.userErrorMessage = '';

  this.cdr.detectChanges();

  this.adminService.getUsers().subscribe({
    next: (data) => {
      this.users = data;
      this.loadingUsers = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Users loading error:', error);

      this.userErrorMessage = 'تعذر تحميل المستخدمين.';
      this.loadingUsers = false;

      this.cdr.detectChanges();
    }
  });
}

    deleteUser(id: string): void {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
    return;
  }

  this.adminService.deleteUser(id).subscribe({
    next: () => {
      this.userMessage = 'تم حذف المستخدم بنجاح.';
      this.userErrorMessage = '';
      this.loadUsers();
    },
    error: (error) => {
      console.error('Delete user error:', error);

      this.userErrorMessage =
        typeof error.error === 'string'
          ? error.error
          : error.error?.message || 'تعذر حذف المستخدم.';

      this.cdr.detectChanges();
    }
  });
}

    


  // =========================
  // Logout
  // =========================

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
