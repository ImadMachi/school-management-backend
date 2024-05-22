import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentsController } from './parents.controller';
import { ParentsService } from './parents.service';
import { Parent } from './entities/parent.entity';
import { CaslModule } from 'src/casl/casl.module';
import { UsersModule } from 'src/users/users.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [TypeOrmModule.forFeature([Parent]), CaslModule, UsersModule, StudentsModule],
  controllers: [ParentsController],
  providers: [ParentsService],
  exports: [ParentsService],
})
export class ParentsModule {}
