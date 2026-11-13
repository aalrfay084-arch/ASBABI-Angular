import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5097/api/Books';

  // عرض جميع الكتب
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // إضافة كتاب
  addBook(book: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // تعديل كتاب
  updateBook(id: number, book: Partial<Book>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, book);
  }

  // حذف كتاب
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}