import {Entity, model, property} from '@loopback/repository';

@model()
export class Books extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  isbn: string;

  @property({
    type: 'string',
    required: true,
  })
  publication_date: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  authorId: number;

  @property({
    type: 'number',
    required: true,
  })
  categoryId: number;


  constructor(data?: Partial<Books>) {
    super(data);
  }
}

export interface BooksRelations {
  // describe navigational properties here
}

export type BooksWithRelations = Books & BooksRelations;
