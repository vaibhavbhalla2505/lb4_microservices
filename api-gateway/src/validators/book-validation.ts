import { injectable,bind,BindingScope } from '@loopback/core';
import axios from 'axios';
export interface Book{
    title: string;
    authorId: number;
    categoryId: number;
    publication_date: string;
    price: number;
    isbn: string;
}

@bind({scope: BindingScope.SINGLETON})
export class BookValidationService {
  private authorServiceUrl = 'http://localhost:3000';
  private categoryServiceUrl = 'http://localhost:3002';
  private bookServiceUrl = 'http://localhost:3001';

  constructor() {}

  async validateBookData(bookData: Book, bookId?: number) {
    const isbnPattern = /^\d{13}$/;
    if (!isbnPattern.test(bookData.isbn)) {
      throw new Error('Invalid ISBN. It must contain exactly 13 digits.');
    }

    if (bookData.price !== undefined && bookData.price <= 0) {
      throw new Error('Price must be greater than zero.');
    }

    const resAuthors = await axios.get(`${this.authorServiceUrl}/authors`);
    const authors = resAuthors.data;
    if (!authors.some((author: { id: number }) => author.id === bookData.authorId)) {
      throw new Error(`Author with id ${bookData.authorId} not found.`);
    }

    const resCategories = await axios.get(`${this.categoryServiceUrl}/categories`);
    const categories = resCategories.data;
    if (!categories.some((category: { id: number }) => category.id === bookData.categoryId)) {
      throw new Error(`Category with id ${bookData.categoryId} not found.`);
    }

    const resBooks = await axios.get(`${this.bookServiceUrl}/books`);
    const books = resBooks.data;
    if (bookData.isbn) {
      const isbnExists = books.some((book: { id: number; isbn: string }) =>
        book.isbn === bookData.isbn && book.id !== bookId 
      );

      if (isbnExists) {
        throw new Error(`Book with ISBN ${bookData.isbn} already exists.`);
      }
    }
  }
}
