import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Absence } from '../absences/entities/absence.entity';

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absence)
    private absentRepository: Repository<Absence>,
  ) {}

  async create(createAbsenceDto: CreateAbsenceDto) {
    const existingAbsence = await this.absentRepository
      .createQueryBuilder('absent')
      .where('absent.absentUser.id = :id', { id: createAbsenceDto.absentUser.id })
      .getOne();
    if (existingAbsence) {
      throw new BadRequestException('Ce Absence existe déjà');
    }
    const newAbsence = await this.absentRepository.save(createAbsenceDto);
    return this.absentRepository.findOne({
      where: { id: newAbsence.id },
      relations: ['absentUser', 'replaceUser'],
    });
  }

  async update(updateAbsenceDto: UpdateAbsenceDto) {
    const absentToUpdate = await this.absentRepository.findOne({
      where: { id: updateAbsenceDto.id },
    });
    if (!absentToUpdate) {
      throw new BadRequestException("Ce Absence n'existe pas");
    }
    const updatedAbsence = await this.absentRepository.save(updateAbsenceDto);
    return this.absentRepository.findOne({
      where: { id: updatedAbsence.id },
      relations: ['absentUser', 'replaceUser'],
    });
  }

  async remove(id: number) {
    const { affected } = await this.absentRepository.delete(id);
    if (affected === 0) {
      throw new BadRequestException("Ce Absence n'existe pas");
    }
    return id;
  }

  async getAbsence(absentId?: number) {
    const absents = await this.absentRepository
      .createQueryBuilder('absent')
      .innerJoinAndSelect('absent.absentUser', 'absentUser')
      .leftJoinAndSelect('absentUser.director', 'director')
      .leftJoinAndSelect('absentUser.administrator', 'administrator')
      .leftJoinAndSelect('absentUser.teacher', 'teacher')
      .leftJoinAndSelect('absentUser.student', 'student')
      .leftJoinAndSelect('absentUser.parent', 'parent')
      .leftJoinAndSelect('absentUser.agent', 'agent')
      .innerJoinAndSelect('absentUser.role', 'role')
      .leftJoinAndSelect('absent.replaceUser', 'replaceUser')
      .getMany();

    let absentsWithReplaceUser = absents;

    const absents2 = await this.absentRepository
      .createQueryBuilder('absent')
      .leftJoinAndSelect('absent.replaceUser', 'replaceUser')
      .leftJoinAndSelect('replaceUser.director', 'replaceDirector')
      .leftJoinAndSelect('replaceUser.administrator', 'replaceAdministrator')
      .leftJoinAndSelect('replaceUser.teacher', 'replaceTeacher')
      .leftJoinAndSelect('replaceUser.student', 'replaceStudent')
      .leftJoinAndSelect('replaceUser.parent', 'replaceParent')
      .leftJoinAndSelect('replaceUser.agent', 'replaceAgent')
      .innerJoinAndSelect('replaceUser.role', 'replaceRole')
      .getMany();

    if (absents2.length > 0) {
      // Perform the join if absents2 contains data
      absentsWithReplaceUser = absents.map((absent) => {
        const found = absents2.find((a) => a.id === absent.id);
        return found ? { ...absent, replaceUser: found.replacingUsers } : absent;
      });
    }

    // If absentId is provided, filter absents to return only the absent with the matching ID
    if (absentId) {
      const foundAbsence = absentsWithReplaceUser.find((absent) => absent.id === absentId);
      return foundAbsence ? [foundAbsence] : [];
    }

    return absentsWithReplaceUser;
  }

  async getAllAbsences() {
    return this.absentRepository.find();
  }
}
