import {bind,BindingScope } from '@loopback/core';
import axios from 'axios';
import { Book } from '../interfaces/interface';

@bind({scope: BindingScope.SINGLETON})
export class BookValidationService {

  constructor() {}

  async validateBookData(bookData: Book, bookId?: number) {
    const isbnPattern = /^\d{13}$/;
    if (!isbnPattern.test(bookData.isbn)) {
      throw new Error('Invalid ISBN. It must contain exactly 13 digits.');
    }

    if (bookData.price !== undefined && bookData.price <= 0) {
      throw new Error('Price must be greater than zero.');
    }

    const resAuthors = await axios.get(`${process.env.AUTHOR_SERVICE_URL}/authors`);
    const authors = resAuthors.data;
    if (!authors.some((author: { id: number }) => author.id === bookData.authorId)) {
      throw new Error(`Author with id ${bookData.authorId} not found.`);
    }

    const resCategories = await axios.get(`${process.env.CATEGORY_SERVICE_URL}/categories`);
    const categories = resCategories.data;
    if (!categories.some((category: { id: number }) => category.id === bookData.categoryId)) {
      throw new Error(`Category with id ${bookData.categoryId} not found.`);
    }

    const resBooks = await axios.get(`${process.env.BOOKS_SERVICE_URL}/books`);
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
