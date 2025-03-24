import {Entity, model, property} from '@loopback/repository';

@model()
export class Authors extends Entity {
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
  name: string;


  constructor(data?: Partial<Authors>) {
    super(data);
  }
}

export interface AuthorsRelations {
  // describe navigational properties here
}

export type AuthorsWithRelations = Authors & AuthorsRelations;
