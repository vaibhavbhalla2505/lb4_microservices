import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'bms',
  connector: 'postgresql',
  url: '',
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'categories'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BmsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'bms';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.bms', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
