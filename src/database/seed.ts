import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseDropCommand, DatabaseDropContext, SeederOptions, dropDatabase, runSeeders } from 'typeorm-extension';
import { dataSourceOptions } from './data-source';
import AppSeeder from './seeders/app.seeder';
import administratorFactory from './factories/administrator.factory';
import roleFactory from './factories/role.factory';
import studentFactory from './factories/student.factory';
import teacherFactory from './factories/teacher.factory';
import userFactory from './factories/user.factory';
import messageFactory from './factories/message.factory';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Administrator } from '../administrators/entities/administrator.entity';
import { Message } from '../messages/entities/message.entity';
import { Attachment } from '../messages/entities/attachment.entity';
import { Director } from '../director/entities/director.entity';

(async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Role, Student, Teacher, Administrator, Message, Attachment, Director],
    synchronize: process.env.NODE_ENV == 'development',
    // @ts-ignore
    autoLoadEntities: true,
    seeds: [AppSeeder],
    factories: [administratorFactory, roleFactory, studentFactory, teacherFactory, userFactory, messageFactory],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();
  await dataSource.dropDatabase();
  await dataSource.synchronize();
  await runSeeders(dataSource);
  await dataSource.destroy();
})();
