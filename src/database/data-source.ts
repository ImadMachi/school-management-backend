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
import { MessageCategory } from '../message-categories/entities/message-category.entity';
const { parse } = require('pg-connection-string');

dotenv.config();

let type = process.env.DB_TYPE || 'postgres';
let host = process.env.DB_HOST;
let port = +process.env.DB_PORT;
let username = process.env.DB_USER;
let password = process.env.DB_PASS;
let database = process.env.DB_NAME;

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  const dbConfig = parse(databaseUrl);
  host = dbConfig.host;
  port = +dbConfig.port;
  username = dbConfig.user;
  password = dbConfig.password;
  database = dbConfig.database;
}

export const dataSourceOptions: DataSourceOptions = {
  type: type as any,
  host,
  port,
  username,
  password,
  database,
  synchronize: process.env.NODE_ENV == 'development',
  entities: [User, Role, Student, Teacher, Administrator, Message, Attachment, Director, MessageCategory],
  // @ts-ignore
  autoLoadEntities: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV == 'development',
  sslmode: 'require',
};
