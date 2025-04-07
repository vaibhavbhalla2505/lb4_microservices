import {get,post,requestBody,patch,param,del,HttpErrors} from '@loopback/rest';
import axios from 'axios';
import { BookValidationService } from '../validators/book-validation';
import { service } from '@loopback/core';
import { authenticate,STRATEGY} from 'loopback4-authentication';
import { UserSignUp,Author,Category,UserLogin,Book } from '../interfaces/interface';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums/permission-key.enum';
export class ApiGatewayController {
  private bookServiceUrl = 'http://localhost:3001'; 
  private authorServiceUrl = 'http://localhost:3000';
  private categoryServiceUrl = 'http://localhost:3002';
  private userServiceUrl = 'http://localhost:3004';

  constructor(
    @service(BookValidationService)
    private bookValidationService: BookValidationService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:[PermissionKey.PostBook]})
  @post('/books')
  async createBook(@requestBody() bookData: Book) {
    try {
      await this.bookValidationService.validateBookData(bookData);

      const response = await axios.post(`${this.bookServiceUrl}/books`, bookData);
      return response.data;
    } catch (error) {
      return { error: 'Failed to fetch books', details: error.message };
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:[PermissionKey.ViewBook]})
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
            author: author.name,
            genre: category.genre,
          };
        })
      );

      return booksWithDetails;
    } catch (error) {
      throw new HttpErrors.InternalServerError('Category service (Port 3002) is unavailable.');
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:[PermissionKey.UpdateBook]})
  @patch('/books/{id}')
  async patchBook(@param.path.number('id') id: number, @requestBody() bookData: Book) {
    try {
      await this.bookValidationService.validateBookData(bookData,id);
      const response = await axios.patch(`${this.bookServiceUrl}/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      return { error: 'Failed to patch book', details: error.message };
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:[PermissionKey.DeleteBook]})
  @del('/books/{id}')
  async deleteBook(@param.path.number('id') id: number) {
    try {
      await axios.delete(`${this.bookServiceUrl}/books/${id}`);
      return { message: `Book with ID ${id} deleted successfully.` };
    } catch (error) {
      return { error: 'Failed to delete book', details: error.message };
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:[PermissionKey.ViewAuthor]})
  @get('/authors')
async getAllAuthors() {
  try {
    const response = await axios.get(`${this.authorServiceUrl}/authors`);
    return response.data;
  } catch (err) {
    throw new HttpErrors.InternalServerError('Author service (Port 3000) is unavailable.');
  }
}

    // Create a new author
    @authenticate(STRATEGY.BEARER)
    @authorize({permissions:[PermissionKey.PostAuthor]})
  @post('/authors')
  async createAuthor(@requestBody() authorData: Author) {
    try {
        if (!authorData.name) {
          throw new Error('Author name is required.');
        }
  
        const response = await axios.post(`${this.authorServiceUrl}/authors`, authorData);
        return response.data;
    } catch (error) {
        return { error: 'Failed to create author', details: error.message };
    }
  }
  
    // Update an existing author
    @authenticate(STRATEGY.BEARER)
    @authorize({permissions:[PermissionKey.UpdateAuthor]})
  @patch('/authors/{id}')
  async updateAuthor(@param.path.number('id') id: number, @requestBody() authorData: Partial<Author>) {
    try {
        if (!authorData.name) {
          throw new Error('Author name cannot be empty.');
        }
  
        const response = await axios.patch(`${this.authorServiceUrl}/authors/${id}`, authorData);
        return response.data;
    } catch (error) {
        return { error: 'Failed to update author', details: error.message };
    }
  }
  
    // Delete an author
    @authenticate(STRATEGY.BEARER)
    @authorize({permissions:[PermissionKey.DeleteAuthor]})
  @del('/authors/{id}')
  async deleteAuthor(@param.path.number('id') id: number) {
    try {
        //Check if any book is linked to the author
        const booksResponse = await axios.get(`${this.bookServiceUrl}/books`);
        const books = booksResponse.data;

        const booksByAuthor = books.filter((book: { authorId: number }) => book.authorId === id);
        if (booksByAuthor.length > 0) {
        return { error: `Cannot delete author. ${booksByAuthor.length} book(s) are linked to this author.` };
        }

        const response = await axios.delete(`${this.authorServiceUrl}/authors/${id}`);
        return { message: 'Author deleted successfully'};
    } catch (error) {
        return { error: 'Failed to delete author', details: error.message };
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:[PermissionKey.ViewCategory]})
  @get('/categories')
  async getAllCategories() {
    try {
      const response = await axios.get(`${this.categoryServiceUrl}/categories`);
      return response.data;
    } catch (error) {
      throw new HttpErrors.InternalServerError('Category service (Port 3002) is unavailable.');
    }
  }
  // Create a new genre
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:[PermissionKey.PostCategory]})
  @post('/categories')
  async createCategory(@requestBody() categoryData: Category) {
    try {
        if (!categoryData.genre) {
          throw new Error('Genre is required.');
        }
  
        const response = await axios.post(`${this.categoryServiceUrl}/categories`, categoryData);
        return response.data;
    } catch (error) {
        return { error: 'Failed to create category', details: error.message };
    }
  }
  
    // Update an existing genre
    @authenticate(STRATEGY.BEARER)
    @authorize({permissions:[PermissionKey.PostCategory]})
  @patch('/categories/{id}')
  async updateCategory(@param.path.number('id') id: number, @requestBody() categoryData: Partial<Category>) {
    try {
        if (!categoryData.genre) {
          throw new Error('Genre cannot be empty.');
        }
  
        const response = await axios.patch(`${this.categoryServiceUrl}/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        return { error: 'Failed to update genre', details: error.message };
    }
  }
  
    // Delete a genre
    @authenticate(STRATEGY.BEARER)
    @authorize({permissions:[PermissionKey.DeleteCategory]})
  @del('/categories/{id}')
  async deleteCategory(@param.path.number('id') id: number) {
    try {
        // Check if any book belongs to this category
        const booksResponse = await axios.get(`${this.bookServiceUrl}/books`);
        const books = booksResponse.data;

        const booksInCategory = books.filter((book: { categoryId: number }) => book.categoryId === id);
        if (booksInCategory.length > 0) {
        return { error: `Cannot delete category. ${booksInCategory.length} book(s) are linked to this category.` };
        }
        
        const response = await axios.delete(`${this.categoryServiceUrl}/categories/${id}`);
        return { message: 'Genre deleted successfully'};
    } catch (error) {
        return { error: 'Failed to delete genre', details: error.message };
    }
  }

  @post('/signup')
  async signup(@requestBody() user: UserSignUp) {
    if (!user.username) {
      throw new Error('username is required.');
    }
    if (!user.email) {
      throw new Error('email is required.');
    }
    if (!user.password) {
      throw new Error('password is required.');
    }
    if (!user.role) {
      throw new Error('role is required.');
    }

    const response = await axios.post(`${this.userServiceUrl}/signup`, user);
    return response.data;
  }

  @post('/login')
  async login(@requestBody() user: UserLogin) {
    if (!user.email) {
      throw new Error('email is required.');
    }
    if (!user.password) {
      throw new Error('password is required.');
    }
    const response = await axios.post(`${this.userServiceUrl}/login`, user);
    return response.data;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:[PermissionKey.ViewUser]})
  @get('/users')
  async getAllUsers() {
    try {
      const response = await axios.get(`${this.userServiceUrl}/users`);
      return response.data;
    } catch (err) {
      throw new HttpErrors.InternalServerError('User service (Port 3004) is unavailable.');
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions:[PermissionKey.DeleteUser]})
  @del('/users/{id}')
  async deleteUser(@param.path.number('id') id: number) {
    try {
        const response = await axios.delete(`${this.userServiceUrl}/users/${id}`);
        return { message: 'User deleted successfully'};
    } catch (error) {
      throw new HttpErrors.InternalServerError('User service (Port 3004) is unavailable.');
    }
  }

    //fetch the authors
    private async fetchAuthor(authorId: number) {
      try {
      const response = await axios.get(`${this.authorServiceUrl}/authors/${authorId}`);
      return response.data;
    } catch (error) {
      throw new HttpErrors.InternalServerError('Author service (Port 3000) is unavailable.');
    }
  }

  //fetch the categories
  private async fetchCategory(categoryId: number) {
    try {
      const response = await axios.get(`${this.categoryServiceUrl}/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new HttpErrors.InternalServerError('Category service (Port 3002) is unavailable.');
    }
  }
}