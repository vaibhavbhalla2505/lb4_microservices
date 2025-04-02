import {Entity, model, property} from '@loopback/repository';
import { IAuthUser } from 'loopback4-authentication';
@model({name:'auth'})
export class User extends Entity implements IAuthUser {
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
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // token: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
