import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Absence } from '../absences/entities/absence.entity';
import { AbsenceDay } from './entities/absence-day.entity';
import { AbsenceSession } from './entities/absence-session.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absence)
    private absenceRepository: Repository<Absence>,
    @InjectRepository(AbsenceDay)
    private absenceDayRepository: Repository<AbsenceDay>,
    @InjectRepository(AbsenceSession)
    private absenceSessionRepository: Repository<AbsenceSession>,
    private dataSource: DataSource,
    private userService: UsersService,
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
  ) { }

  async create(createAbsenceDto: CreateAbsenceDto) {
    const newAbsence = await this.absenceRepository.insert(createAbsenceDto);

    return this.getAbsence(newAbsence.identifiers[0].id);
  }

  async update(updateAbsenceDto: UpdateAbsenceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let absence: Absence;

    try {
      const absenceToUpdate = await this.absenceRepository.findOne({
        where: { id: updateAbsenceDto.id },
      });
      if (!absenceToUpdate) {
        throw new BadRequestException("Cet Absence n'existe pas");
      }

      absenceToUpdate.justified = updateAbsenceDto.justified;
      absenceToUpdate.status = updateAbsenceDto.status;

      const absenceDays = [];

      for (const absenceDay of updateAbsenceDto.absenceDays) {
        const newAbsenceDay = await this.absenceDayRepository.save({
          ...absenceDay,
          absence: absenceToUpdate,
        });

        const newSessions = [];

        for (const session of absenceDay.sessions) {
          let user = null;
          if (session.user) {
            user = await this.userService.findOne(session.user.id);
          }
          const result = await this.absenceSessionRepository.insert({
            user,
            absenceDay: newAbsenceDay,
          });

          const newSession = await this.absenceSessionRepository.findOne({
            where: { id: result.identifiers[0].id },
          });

          newSessions.push(newSession);
        }

        newAbsenceDay.sessions = newSessions;

        absenceDays.push(newAbsenceDay);
      }

      absenceToUpdate.absenceDays = absenceDays;

      await this.absenceRepository.save(absenceToUpdate);

      absence = await this.getAbsence(updateAbsenceDto.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();

    return absence;
  }

  async remove(id: number) {
    const absence = await this.absenceRepository.findOne({ where: { id } });
    if (!absence) {
      throw new BadRequestException("Cet Absence n'existe pas");
    }

    absence.active = false;

    await this.absenceRepository.save(absence);

    return absence;
  }

  getAbsence(absenceId: number) {
    return this.absenceRepository
      .createQueryBuilder('absence')
      .where('absence.id = :absenceId', { absenceId })
      .andWhere('absence.active = true')
      .leftJoinAndSelect('absence.absentUser', 'absentUser')
      .leftJoinAndSelect('absentUser.role', 'role')
      .leftJoinAndSelect('absentUser.director', 'director')
      .leftJoinAndSelect('absentUser.administrator', 'administrator')
      .leftJoinAndSelect('absentUser.teacher', 'teacher')
      .leftJoinAndSelect('absentUser.student', 'student')
      .leftJoinAndSelect('absentUser.parent', 'parent')
      .leftJoinAndSelect('absentUser.agent', 'agent')
      .leftJoinAndSelect('absence.absenceDays', 'absenceDays')
      .leftJoinAndSelect('absenceDays.sessions', 'session')
      .leftJoinAndSelect('session.user', 'user')
      .getOne();
  }

  getAllAbsences() {
    return this.absenceRepository
      .createQueryBuilder('absence')
      .where('absence.active = true')
      .leftJoinAndSelect('absence.absentUser', 'absentUser')
      .leftJoinAndSelect('absentUser.role', 'role')
      .leftJoinAndSelect('absentUser.director', 'director')
      .leftJoinAndSelect('absentUser.administrator', 'administrator')
      .leftJoinAndSelect('absentUser.teacher', 'teacher')
      .leftJoinAndSelect('absentUser.student', 'student')
      .leftJoinAndSelect('absentUser.parent', 'parent')
      .leftJoinAndSelect('absentUser.agent', 'agent')
      .leftJoinAndSelect('absence.absenceDays', 'absenceDays')
      .leftJoinAndSelect('absenceDays.sessions', 'session')
      .leftJoinAndSelect('session.user', 'user')
      .orderBy('absence.id', 'DESC')
      .getMany();
  }

  
  // async countUserAbsencesAndReplacements(userId: number) {
  //   // Fetch all active absences for the user
  //   const userAbsences = await this.absenceRepository.find({
  //     where: { absentUser: { id: userId }, active: true },
  //     relations: ['absenceDays', 'absenceDays.sessions'],
  //   });

  //   // Calculate total absences, justified/unjustified counts, and days absent
  //   const totalAbsences = userAbsences.length;
  //   const justifiedAbsences = userAbsences.filter(absence => absence.justified).length;
  //   const unjustifiedAbsences = totalAbsences - justifiedAbsences;
  //   const totalDaysAbsent = userAbsences.reduce((total, absence) => total + differenceInDays(absence.endDate, absence.startDate) + 1, 0);
  //   const totalSessionsAbsent = userAbsences.reduce((total, absence) => total + absence.absenceDays.reduce((sum, day) => sum + day.sessions.length, 0), 0);

  //   // Fetch all sessions where the user is a replacement
  //   const userReplacements = await this.absenceSessionRepository.find({
  //     where: { user: { id: userId } },
  //     relations: ['absenceDay'],
  //   });

  //   // Calculate total replacements, days, and sessions
  //   const totalReplacements = userReplacements.length;
  //   const uniqueReplacementDays = new Set(userReplacements.map(session => session.absenceDay.date.toDateString())).size;
  //   const totalSessionsReplaced = userReplacements.length;

  //   return {
  //     totalAbsences,
  //     justifiedAbsences,
  //     unjustifiedAbsences,
  //     totalDaysAbsent,
  //     totalSessionsAbsent,
  //     totalReplacements,
  //     uniqueReplacementDays,
  //     totalSessionsReplaced,
  //   };
  // }

  // async updateUserAbsenceCounts(userId: number) {
  //   const stats = await this.countUserAbsencesAndReplacements(userId);

  //   // Update user's absence and replacement counts
  //   await this.userRepository.update(userId, {
  //     totalAbsences: stats.totalAbsences,
  //     justifiedAbsences: stats.justifiedAbsences,
  //     unjustifiedAbsences: stats.unjustifiedAbsences,
  //     dailyAbsences: stats.totalDaysAbsent,
  //     totalReplacements: stats.totalReplacements,
  //     dailyReplacements: stats.uniqueReplacementDays,
  //     justifiedReplacements: 0, // To be determined if needed
  //     unjustifiedReplacements: 0, // To be determined if needed
  //   });
  // }

  async getTotalAbsencesPerDay(): Promise<{ date: string, count: number }[]> {
    const absences = await this.absenceRepository.find({
      select: ['startDate', 'endDate'],
    });

    const absencesPerDay: Record<string, number> = {};

    absences.forEach(absence => {
      let currentDate = new Date(absence.startDate);
      const endDate = new Date(absence.endDate);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];

        if (absencesPerDay[dateString]) {
          absencesPerDay[dateString] += 1;
        } else {
          absencesPerDay[dateString] = 1;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return Object.keys(absencesPerDay).map(date => ({
      date,
      count: absencesPerDay[date],
    }));
  }
}