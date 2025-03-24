import {get,post,requestBody} from '@loopback/rest';
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
      const isbnPattern = /^\d{13}$/; 
      if (!isbnPattern.test(bookData.isbn)) {
        throw new Error('Invalid ISBN. It must contain exactly 13 digits.');
      }

      if(bookData.price<=0){
        throw new Error('Price must be greater than zero.');
      }

      const resAuthors = await axios.get(`${this.authorServiceUrl}/authors`);
      const authors=resAuthors.data;

      const authorExists = authors.some((author:{id:number})=>author.id===bookData.authorId)
      if(!authorExists){
        throw new Error(`Author with id ${bookData.authorId} not found.`);
      }

      const resCategories = await axios.get(`${this.categoryServiceUrl}/categories`);
      const categories=resCategories.data;

      const categoryExists = categories.some((category:{id:number})=>category.id===bookData.categoryId)
      if(!categoryExists){
        throw new Error(`Category with id ${bookData.categoryId} not found.`);
      }

      const resBooks=await axios.get(`${this.bookServiceUrl}/books`);
      const books=resBooks.data;

      const isbnExists=books.some((book:{isbn:string})=>book.isbn===bookData.isbn);
      if(isbnExists){
        throw new Error(`Book with isbn ${bookData.isbn} already exists.`);
      }

      const response = await axios.post(`${this.bookServiceUrl}/books`, bookData);
      return response.data;
    } catch (error) {
      return { error: 'Failed to fetch books', details: error.message };
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
  
  private async fetchAuthor(authorId: number) {
      try {
      const response = await axios.get(`${this.authorServiceUrl}/authors/${authorId}`);
      return response.data;
    } catch (error) {
      return {error: `Author not found for id ${authorId}`};
    }
  }

  private async fetchCategory(categoryId: number) {
    try {
      const response = await axios.get(`${this.categoryServiceUrl}/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      return {error: `Category not found for id ${categoryId}`};
    }
  }
}