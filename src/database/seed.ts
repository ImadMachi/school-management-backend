import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseDropCommand, DatabaseDropContext, SeederOptions, dropDatabase, runSeeders } from 'typeorm-extension';
import { dataSourceOptions } from './data-source';
import AppSeeder from './seeders/app.seeder';
import administratorFactory from './factories/administrator.factory';
import roleFactory from './factories/role.factory';
import studentFactory from './factories/student.factory';
import teacherFactory from './factories/teacher.factory';
import userFactory from './factories/user.factory';

(async () => {
  const options: DataSourceOptions & SeederOptions = {
    ...dataSourceOptions,
    seeds: [AppSeeder],
    factories: [administratorFactory, roleFactory, studentFactory, teacherFactory, userFactory],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();
  await dataSource.dropDatabase();
  await dataSource.synchronize();
  await runSeeders(dataSource);
  await dataSource.destroy();
})();
