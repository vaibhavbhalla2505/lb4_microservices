import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BmsDataSource} from '../datasources';
import {Categories, CategoriesRelations} from '../models';

export class CategoriesRepository extends DefaultCrudRepository<
  Categories,
  typeof Categories.prototype.id,
  CategoriesRelations
> {
  constructor(
    @inject('datasources.bms') dataSource: BmsDataSource,
  ) {
    super(Categories, dataSource);
  }
}
