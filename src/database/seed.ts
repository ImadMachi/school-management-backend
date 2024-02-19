import { DataSource, DataSourceOptions } from 'typeorm';

import { SeederOptions, runSeeders } from 'typeorm-extension';
import AppSeeder from './seeders/app.seeder';
import administratorFactory from './factories/administrator.factory';
import roleFactory from './factories/role.factory';
import studentFactory from './factories/student.factory';
import teacherFactory from './factories/teacher.factory';
import userFactory from './factories/user.factory';
import messageFactory from './factories/message.factory';
import { dataSourceOptions } from './data-source';
import messageCategoryFactory from './factories/message-category.factory';
import parentFactory from './factories/parent.factory';
import directorFactory from './factories/director.factory';
import classFactory from './factories/class.factory';

async function seed() {
  const options: DataSourceOptions & SeederOptions = {
    ...dataSourceOptions,
    seeds: [AppSeeder],
    factories: [
      directorFactory,
      administratorFactory,
      roleFactory,
      studentFactory,
      teacherFactory,
      parentFactory,
      userFactory,
      messageFactory,
      messageCategoryFactory,
      classFactory,
    ],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();
  await dataSource.dropDatabase();
  await dataSource.synchronize();
  await runSeeders(dataSource);
  await dataSource.destroy();
}

seed();
