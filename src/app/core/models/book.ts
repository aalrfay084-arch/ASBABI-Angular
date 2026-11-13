export interface Book {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
  authorId: number;
  categoryId: number;

  author: {
    authorId: number;
    name: string;
    biography: string;
  };

  category: {
    categoryId: number;
    name: string;
    description: string;
  };
}