import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Administrator } from '../administrators/entities/administrator.entity';
import { Role } from '../roles/entities/role.entity';
import { Message } from '../messages/entities/message.entity';
import { Attachment } from '../messages/entities/attachment.entity';
import { Director } from '../director/entities/director.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Role, Student, Teacher, Administrator, Message, Attachment, Director],
  synchronize: process.env.NODE_ENV == 'development', // Only for development mode
  // @ts-ignore
  autoLoadEntities: true,
};
