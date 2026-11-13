export interface Purchase {
  purchaseId: number;
  userName: string;
  userId: string;

  bookId: number;
  quantity: number;

  unitPrice: number;
  totalAmount: number;

  purchaseDate: string;
  approvalDate: string | null;
  expiryDate: string | null;
  completionDate: string | null;

  status: string;
  paymentStatus: string;

  book?: {
    bookId: number;
    title: string;
    price: number;
    quantity: number;
    author?: {
      name: string;
    };
  };
}

export interface CreatePurchase {
  bookId: number;
  quantity: number;
}
