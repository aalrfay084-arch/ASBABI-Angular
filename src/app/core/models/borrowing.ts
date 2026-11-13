import { Book } from './book';

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
  book: Book | null;
}