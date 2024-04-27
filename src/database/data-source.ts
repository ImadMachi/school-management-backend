import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Administrator } from '../administrators/entities/administrator.entity';
import { Parent } from '../parents/entities/parent.entity';
import { Role } from '../roles/entities/role.entity';
import { Message } from '../messages/entities/message.entity';
import { Attachment } from '../messages/entities/attachment.entity';
import { Director } from '../director/entities/director.entity';
import { MessageCategory } from '../message-categories/entities/message-category.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Template } from 'src/templates/entities/template.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Cycle } from 'src/cycles/entities/cycle.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Agent } from 'src/agent/entities/agent.entity';
import { Absence } from 'src/absences/entities/absence.entity';
import { AbsenceDay } from 'src/absences/entities/absence-day.entity';
import { AbsenceSession } from 'src/absences/entities/absence-session.entity';
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
  entities: [
    User,
    Role,
    Student,
    Teacher,
    Administrator,
    Parent,
    Message,
    MessageCategory,
    Template,
    Group,
    Attachment,
    Director,
    Agent,
    MessageCategory,
    Class,
    Level,
    Cycle,
    Subject,
    Absence,
    AbsenceDay,
    AbsenceSession,
  ],
  synchronize: process.env.NODE_ENV == 'development',
  // @ts-ignore
  autoLoadEntities: true,
  // logging: true,
  // extra:
  //   process.env.NODE_ENV == 'development'
  //     ? {}
  //     : {
  //         ssl: {
  //           rejectUnauthorized: false,
  //         },
  //       },
  // sslmode: process.env.NODE_ENV == 'development' ? 'disable' : 'require',
};

export default new DataSource(dataSourceOptions);
