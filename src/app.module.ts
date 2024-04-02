import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CaslModule } from './casl/casl.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { AdministratorsModule } from './administrators/administrators.module';
import { RolesModule } from './roles/roles.module';
import { DirectorModule } from './director/director.module';
import { MessagesModule } from './messages/messages.module';
import { MessageCategoriesModule } from './message-categories/message-categories.module';
import { ParentsModule } from './parents/parents.module';
import { ClassesModule } from './classes/classes.module';
import { TemplatesModule } from './templates/templates.module';
import { LevelsModule } from './levels/levels.module';
import { CyclesModule } from './cycles/cycles.module';
import { GroupsModule } from './groups/groups.module';
import { AgentsModule } from './agent/agents.module';
import { SubjectModule } from './subjects/subjects.module';
import { AbsentModule } from './absent/absent.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.local.env'],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    CaslModule,
    TeachersModule,
    StudentsModule,
    AdministratorsModule,
    RolesModule,
    DirectorModule,
    MessagesModule,
    MessageCategoriesModule,
    ParentsModule,
    ClassesModule,
    TemplatesModule,
    LevelsModule,
    CyclesModule,
    GroupsModule,
    AgentsModule,
    SubjectModule,
    AbsentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
