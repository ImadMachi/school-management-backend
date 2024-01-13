import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CaslModule } from './casl/casl.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { AdministratorsModule } from './administrators/administrators.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.local.env'],
      isGlobal: true,
    }),
    CaslModule,
    TeachersModule,
    StudentsModule,
    AdministratorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
