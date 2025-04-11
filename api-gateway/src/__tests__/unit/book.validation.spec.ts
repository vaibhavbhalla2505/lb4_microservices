import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import axios from 'axios';
import { BookValidationService } from '../../validators/book.validation';

describe('BookValidationService (unit)', () => {
  let service: BookValidationService;
  let axiosGetStub: sinon.SinonStub;

  const validBook = {
    id: 1,
    title: 'Test Book',
    authorId: 10,
    categoryId: 20,
    isbn: '1234567890123',
    publicationDate: '2023-01-01',
    price: 100,
  };

  beforeEach(() => {
    service = new BookValidationService();
    axiosGetStub = sinon.stub(axios, 'get');
  });

  afterEach(() => {
    sinon.restore(); 
  });

  it('should pass validation for a valid book', async () => {
    axiosGetStub.withArgs('http://localhost:3000/authors').resolves({data: [{id: 10}]});
    axiosGetStub.withArgs('http://localhost:3002/categories').resolves({data: [{id: 20}]});
    axiosGetStub.withArgs('http://localhost:3001/books').resolves({data: []});

    await service.validateBookData(validBook);
  });

  it('should throw error for invalid ISBN', async () => {
    const book = {...validBook, isbn: '12345'};
    await expect(service.validateBookData(book)).to.be.rejectedWith(
      'Invalid ISBN. It must contain exactly 13 digits.',
    );
  });

  it('should throw error for price <= 0', async () => {
    const book = {...validBook, price: 0};
    await expect(service.validateBookData(book)).to.be.rejectedWith(
      'Price must be greater than zero.',
    );
  });

  it('should throw error if author does not exist', async () => {
    axiosGetStub.withArgs('http://localhost:3000/authors').resolves({data: []});

    await expect(service.validateBookData(validBook)).to.be.rejectedWith(
      `Author with id ${validBook.authorId} not found.`,
    );
  });

  it('should throw error if category does not exist', async () => {
    axiosGetStub.withArgs('http://localhost:3000/authors').resolves({data: [{id: 10}]});
    axiosGetStub.withArgs('http://localhost:3002/categories').resolves({data: []});

    await expect(service.validateBookData(validBook)).to.be.rejectedWith(
      `Category with id ${validBook.categoryId} not found.`,
    );
  });

  it('should throw error if ISBN already exists (different book ID)', async () => {
    axiosGetStub.withArgs('http://localhost:3000/authors').resolves({data: [{id: 10}]});
    axiosGetStub.withArgs('http://localhost:3002/categories').resolves({data: [{id: 20}]});
    axiosGetStub
      .withArgs('http://localhost:3001/books')
      .resolves({data: [{id: 2, isbn: validBook.isbn}]});

    await expect(service.validateBookData(validBook, 1)).to.be.rejectedWith(
      `Book with ISBN ${validBook.isbn} already exists.`,
    );
  });

  it('should allow same ISBN if it belongs to the same book being updated', async () => {
    axiosGetStub.withArgs('http://localhost:3000/authors').resolves({data: [{id: 10}]});
    axiosGetStub.withArgs('http://localhost:3002/categories').resolves({data: [{id: 20}]});
    axiosGetStub
      .withArgs('http://localhost:3001/books')
      .resolves({data: [{id: 1, isbn: validBook.isbn}]});

    await service.validateBookData(validBook, 1);
  });
});
