import {expect,createStubInstance,StubbedInstanceWithSinonAccessor} from '@loopback/testlab';
import sinon from 'sinon';
import {BooksController} from '../../controllers';
import {BooksRepository} from '../../repositories';
import {Books} from '../../models';

describe('BooksController (unit)', () => {
  let booksRepo: StubbedInstanceWithSinonAccessor<BooksRepository>;
  let controller: BooksController;

  const sampleBook: Books = new Books({
    id: 1,
    title: 'Test Book',
    isbn: '123-456-789',
    publicationDate: '2023-01-01',
    price: 100,
    authorId: 1,
    categoryId: 1,
  });

  beforeEach(() => {
    booksRepo = createStubInstance(BooksRepository);
    controller = new BooksController(booksRepo);
  });

  afterEach(() => sinon.restore());

  it('should create a new book', async () => {
    booksRepo.stubs.create.resolves(sampleBook);
    const result = await controller.create(sampleBook);
    expect(result).to.eql(sampleBook);
  });

  it('should return book count', async () => {
    booksRepo.stubs.count.resolves({count: 1});
    const result = await controller.count();
    expect(result.count).to.equal(1);
  });

  it('should find all books', async () => {
    booksRepo.stubs.find.resolves([sampleBook]);
    const result = await controller.find();
    expect(result).to.eql([sampleBook]);
  });

  it('should update books with filter', async () => {
    const updateData = new Books({title: 'New Name'});

    booksRepo.stubs.updateAll.resolves({count: 1});

    const result = await controller.updateAll(updateData, {title: 'Test Book'});
    expect(result.count).to.equal(1);
  });

  it('should find book by ID', async () => {
    booksRepo.stubs.findById.resolves(sampleBook);
    const result = await controller.findById(1);
    expect(result).to.eql(sampleBook);
  });

  it('should patch a book by ID', async () => {
    const updatedBook = new Books({
        title: 'Test Book',
        isbn: '123-456-789',
        publicationDate: '2023-01-01',
        price: 200,
        authorId: 2,
        categoryId: 2,});
    booksRepo.stubs.updateById.resolves();
    await controller.updateById(1, updatedBook);
    sinon.assert.calledWith(booksRepo.stubs.updateById, 1, updatedBook);
  });

  it('should replace a book by ID', async () => {
    booksRepo.stubs.replaceById.resolves();
    await controller.replaceById(1, sampleBook);
    sinon.assert.calledWith(booksRepo.stubs.replaceById, 1, sampleBook);
  });

  it('should delete a book by ID', async () => {
    booksRepo.stubs.deleteById.resolves();
    await controller.deleteById(1);
    sinon.assert.calledWith(booksRepo.stubs.deleteById, 1);
  });
});
