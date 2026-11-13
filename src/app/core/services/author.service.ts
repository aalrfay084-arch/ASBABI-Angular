
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from '../models/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5097/api/Authors';

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }

  getAuthorById(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`);
  }

  addAuthor(author: Partial<Author>): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  updateAuthor(id: number, author: Partial<Author>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, author);
  }

  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
