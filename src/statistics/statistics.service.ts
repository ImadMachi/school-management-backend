// src/statistics/statistics.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from './entities/statistics.entity';
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
@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Director)
    private directorRepository: Repository<Director>,
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cycle)
    private cycleRepository: Repository<Cycle>,
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Absence)
    private absenceRepository: Repository<Absence>,
  ) {}

  async getStatistics(): Promise<Statistics> {
    const statistics = new Statistics();
    statistics.recordedAt = new Date();

    // Count entities from respective repositories
    statistics.administratorsCount = await this.administratorRepository.count();
    statistics.directorsCount = await this.directorRepository.count();
    statistics.teachersCount = await this.teacherRepository.count();
    statistics.parentsCount = await this.parentRepository.count();
    statistics.agentsCount = await this.agentRepository.count();
    statistics.studentsCount = await this.studentRepository.count();
    statistics.usersCount = await this.userRepository.count();

    statistics.cyclesCount = await this.cycleRepository.count();
    statistics.levelsCount = await this.levelRepository.count();
    statistics.classesCount = await this.classRepository.count();
    statistics.absencesCount = await this.absenceRepository.count();

    return statistics;
  }
}
