import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Books} from '../models';
import {BooksRepository} from '../repositories';

export class BooksController {
  constructor(
    @repository(BooksRepository)
    public booksRepository : BooksRepository,
  ) {}

  @post('/books')
  @response(200, {
    description: 'Books model instance',
    content: {'application/json': {schema: getModelSchemaRef(Books)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Books, {
            title: 'NewBooks',
            exclude: ['id'],
          }),
        },
      },
    })
    books: Omit<Books, 'id'>,
  ): Promise<Books> {
    return this.booksRepository.create(books);
  }

  @get('/books/count')
  @response(200, {
    description: 'Books model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Books) where?: Where<Books>,
  ): Promise<Count> {
    return this.booksRepository.count(where);
  }

  @get('/books')
  @response(200, {
    description: 'Array of Books model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Books, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Books) filter?: Filter<Books>,
  ): Promise<Books[]> {
    return this.booksRepository.find(filter);
  }

  @patch('/books')
  @response(200, {
    description: 'Books PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Books, {partial: true}),
        },
      },
    })
    books: Books,
    @param.where(Books) where?: Where<Books>,
  ): Promise<Count> {
    return this.booksRepository.updateAll(books, where);
  }

  @get('/books/{id}')
  @response(200, {
    description: 'Books model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Books, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Books, {exclude: 'where'}) filter?: FilterExcludingWhere<Books>
  ): Promise<Books> {
    return this.booksRepository.findById(id, filter);
  }

  @patch('/books/{id}')
  @response(204, {
    description: 'Books PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Books, {partial: true}),
        },
      },
    })
    books: Books,
  ): Promise<void> {
    await this.booksRepository.updateById(id, books);
  }

  @put('/books/{id}')
  @response(204, {
    description: 'Books PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() books: Books,
  ): Promise<void> {
    await this.booksRepository.replaceById(id, books);
  }

  @del('/books/{id}')
  @response(204, {
    description: 'Books DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.booksRepository.deleteById(id);
  }
}
