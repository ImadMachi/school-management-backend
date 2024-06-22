// src/statistics/statistics.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistics } from './entities/statistics.entity';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Student } from 'src/students/entities/student.entity';
import { User } from 'src/users/entities/user.entity';
import { Cycle } from 'src/cycles/entities/cycle.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Absence } from 'src/absences/entities/absence.entity';
import { Administrator } from 'src/administrators/entities/administrator.entity'; // Import Administrator entity
import { Director } from 'src/director/entities/director.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Agent } from 'src/agent/entities/agent.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Statistics,
      Student,
      User,
      Cycle,
      Level,
      Class,
      Absence,
      Administrator, // Include Administrator entity here
      Director,
      Parent,
      Teacher,
      Agent,
    ]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
