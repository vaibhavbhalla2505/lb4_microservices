import {get,post,requestBody,patch,param,del} from '@loopback/rest';
import axios from 'axios';
interface Book{
  title: string;
  authorId: number;
  categoryId: number;
  publication_date: string;
  price: number;
  isbn: string;
}
export class ApiGatewayController {
  private bookServiceUrl = 'http://localhost:3001'; 
  private authorServiceUrl = 'http://localhost:3000';
  private categoryServiceUrl = 'http://localhost:3002';

  constructor() {}

  @post('/books')
  async createBook(@requestBody() bookData: Book) {
    try {
        await this.validateBookData(bookData);

      const response = await axios.post(`${this.bookServiceUrl}/books`, bookData);
      return response.data;
    } catch (error) {
      return { error: 'Failed to fetch books', details: error.message };
    }
  }

  @get('/books')
  async getBooks() {
    try {
      const booksResponse = await axios.get(`${this.bookServiceUrl}/books`);
      const books = booksResponse.data;
  
      const booksWithDetails = await Promise.all(
        books.map(async (book: any) => {
          const author = await this.fetchAuthor(book.authorId);
          const category = await this.fetchCategory(book.categoryId);
  
          return {
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            publication_date: book.publication_date, 
            price: book.price,
            author: author?.name || null, 
            genre: category?.genre || null,
          };
        })
      );
  
      return booksWithDetails;
    } catch (error) {
      return { error: 'Failed to fetch books', details: error.message };
    }
  }

  @patch('/books/{id}')
  async patchBook(@param.path.number('id') id: number, @requestBody() bookData: Book) {
    try {
      await this.validateBookData(bookData,id);
      const response = await axios.patch(`${this.bookServiceUrl}/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      return { error: 'Failed to patch book', details: error.message };
    }
  }

  @del('/books/{id}')
  async deleteBook(@param.path.number('id') id: number) {
    try {
      await axios.delete(`${this.bookServiceUrl}/books/${id}`);
      return { message: `Book with ID ${id} deleted successfully.` };
    } catch (error) {
      return { error: 'Failed to delete book', details: error.message };
    }
  }

  @get('/authors')
  async getAllAuthors() {
    const response = await axios.get(`${this.authorServiceUrl}/authors`);
    return response.data;
  }

  @get('/categories')
  async getAllCategories() {
    const response = await axios.get(`${this.categoryServiceUrl}/categories`);
    return response.data;
  }
  
  //fetch the authors
  private async fetchAuthor(authorId: number) {
      try {
      const response = await axios.get(`${this.authorServiceUrl}/authors/${authorId}`);
      return response.data;
    } catch (error) {
      return {error: `Author not found for id ${authorId}`};
    }
  }

  //fetch the categories
  private async fetchCategory(categoryId: number) {
    try {
      const response = await axios.get(`${this.categoryServiceUrl}/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      return {error: `Category not found for id ${categoryId}`};
    }
  }

  //validations 
  async validateBookData(bookData: Book,bookId?:number) {
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
          book.isbn === bookData.isbn && book.id !== bookId // Ignore current book's ISBN
        );
    
        if (isbnExists) {
          throw new Error(`Book with ISBN ${bookData.isbn} already exists.`);
        }
      }
  }
}