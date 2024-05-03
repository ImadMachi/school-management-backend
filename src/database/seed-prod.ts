import { DataSource, DataSourceOptions } from 'typeorm';

import { SeederOptions, runSeeders } from 'typeorm-extension';
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
import levelFactory from './factories/level.factory';
import attachmentFactory from './factories/attachment.factory';
import templateFactory from './factories/template.factor';
import cycleFactory from './factories/cycle.factory';
import groupFactory from './factories/group.factory';
import subjectFactory from './factories/subject.factory';
import agentFactory from './factories/agent.factory';
import absenceFactory from './factories/absence.factory';
import AppSeeder from './seeders/prod.seeder';

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
      agentFactory,
      userFactory,
      messageFactory,
      templateFactory,
      groupFactory,
      messageCategoryFactory,
      classFactory,
      levelFactory,
      cycleFactory,
      subjectFactory,
      attachmentFactory,
      absenceFactory,
    ],
  };

  const dataSource = new DataSource(options);
  try {
    await dataSource.initialize();
    await dataSource.dropDatabase();
    await dataSource.synchronize();
    await runSeeders(dataSource);
    await dataSource.destroy();
  } catch (error) {
    console.error(error);
  }
}

seed();
