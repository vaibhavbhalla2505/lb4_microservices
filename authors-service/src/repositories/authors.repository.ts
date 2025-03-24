import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BmsDataSource} from '../datasources';
import {Authors, AuthorsRelations} from '../models';

export class AuthorsRepository extends DefaultCrudRepository<
  Authors,
  typeof Authors.prototype.id,
  AuthorsRelations
> {
  constructor(
    @inject('datasources.bms') dataSource: BmsDataSource,
  ) {
    super(Authors, dataSource);
  }
}
