import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Absence } from '../absences/entities/absence.entity';
import { AbsenceDay } from './entities/absence-day.entity';
import { AbsenceSession } from './entities/absence-session.entity';
import { UsersService } from 'src/users/users.service';
import { endOfDay, endOfWeek, startOfDay, startOfWeek } from 'date-fns';

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

  private getCurrentWeekRange() {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 }); // Assuming week starts on Monday
    const end = endOfWeek(now, { weekStartsOn: 1 });
    return { start, end };
  }

  private getCurrentDayRange() {
    const now = new Date();
    const start = startOfDay(now);
    const end = endOfDay(now);
    return { start, end };
  }

  async getUserAbsenceAndReplacementCount(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const { start: weekStart, end: weekEnd } = this.getCurrentWeekRange();
    const { start: dayStart, end: dayEnd } = this.getCurrentDayRange();

    // Total absence count
    const totalAbsences = await this.absenceRepository.count({
      where: { absentUser: user },
    });

    // Total replacement count
    const totalReplacements = await this.absenceSessionRepository.count({
      where: { user },
    });

    // Weekly absence count
    const weeklyAbsences = await this.absenceRepository.count({
      where: {
        absentUser: user,
        startDate: MoreThanOrEqual(weekStart),
        endDate: LessThanOrEqual(weekEnd),
      },
    });

    // Weekly replacement count
    const weeklyReplacements = await this.absenceSessionRepository.count({
      where: {
        user,
        absenceDay: {
          date: Between(weekStart, weekEnd),
        },
      },
      relations: ['absenceDay'],
    });

    // Daily absence count
    const dailyAbsences = await this.absenceRepository.count({
      where: {
        absentUser: user,
        startDate: MoreThanOrEqual(dayStart),
        endDate: LessThanOrEqual(dayEnd),
      },
    });

    // Daily replacement count
    const dailyReplacements = await this.absenceSessionRepository.count({
      where: {
        user,
        absenceDay: {
          date: Between(dayStart, dayEnd),
        },
      },
      relations: ['absenceDay'],
    });

    return {
      totalAbsences,
      totalReplacements,
      weeklyAbsences,
      weeklyReplacements,
      dailyAbsences,
      dailyReplacements,
    };
  }
}