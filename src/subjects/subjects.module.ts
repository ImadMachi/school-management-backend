import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { CaslModule } from 'src/casl/casl.module';
import { Subject } from './entities/subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesModule } from 'src/classes/classes.module';
import { TeachersModule } from 'src/teachers/teachers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subject]), CaslModule, ClassesModule, TeachersModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService],
})
export class SubjectModule {}
