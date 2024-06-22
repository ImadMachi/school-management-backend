import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CsvParserService } from './csv-parser.service';
import { ParentsModule } from 'src/parents/parents.module';
import { CyclesModule } from 'src/cycles/cycles.module';
import { LevelsModule } from 'src/levels/levels.module';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), UsersModule, ParentsModule, CyclesModule, LevelsModule, ClassesModule],
  controllers: [StudentsController],
  providers: [StudentsService, CsvParserService],
  exports: [StudentsService],
})
export class StudentsModule {}
