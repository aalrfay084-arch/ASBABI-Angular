import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Borrowing {
  borrowingId: number;
  userId: string;
  requestDate: string;
  borrowDate: string | null;
  dueDate: string | null;
  returnDate: string | null;
  status: string;
  borrowingFee: number;
  lateFee: number;
  isLateFeePaid: boolean;
  lateFeePaidDate: string | null;
  bookId: number;
  book?: {
    bookId: number;
    title: string;
    price: number;
    author?: {
      name: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class BorrowingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5097/api/Borrowings';

  createBorrowing(bookId: number): Observable<unknown> {
    return this.http.post(this.apiUrl, {
      bookId: bookId
    });
  }

  getMyBorrowings(): Observable<Borrowing[]> {
    return this.http.get<Borrowing[]>(`${this.apiUrl}/my`);
  }

  getAllBorrowings(): Observable<Borrowing[]> {
    return this.http.get<Borrowing[]>(this.apiUrl);
  }

  updateBorrowingStatus(id: number, status: string): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, { status });
  }

  deleteBorrowing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  payLateFee(id: number): Observable<string> {
    return this.http.put(
      `${this.apiUrl}/${id}/pay-late-fee`,
      null,
      { responseType: 'text' }
    );
  }
}