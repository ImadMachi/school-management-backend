import { Module } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { AbsencesController } from './absences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Absence } from './entities/absence.entity';
import { AbsenceDay } from './entities/absence-day.entity';
import { AbsenceSession } from './entities/absence-session.entity';
import { CaslModule } from 'src/casl/casl.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Absence, AbsenceDay, AbsenceSession]), UsersModule, CaslModule],
  controllers: [AbsencesController],
  providers: [AbsencesService],
})
export class AbsencesModule {}
