import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAbsentDto } from './dto/create-absent.dto';
import { UpdateAbsentDto } from './dto/update-absent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Absent } from './entities/absent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AbsentService {
  constructor(
    @InjectRepository(Absent)
    private absentRepository: Repository<Absent>,
  ) {}

  async create(createAbsentDto: CreateAbsentDto) {
    const existingAbsent = await this.absentRepository
      .createQueryBuilder('absent')
      .where('absent.absentUser.id = :id', { id: createAbsentDto.absentUser.id })
      .getOne();
    if (existingAbsent) {
      throw new BadRequestException('Ce Absent existe déjà');
    }
    const newAbsent = await this.absentRepository.save(createAbsentDto);
    return this.absentRepository.findOne({
      where: { id: newAbsent.id },
      relations: ['absentUser', 'replaceUser'],
    });
  }

  async update(updateAbsentDto: UpdateAbsentDto) {
    const absentToUpdate = await this.absentRepository.findOne({
      where: { id: updateAbsentDto.id },
    });
    if (!absentToUpdate) {
      throw new BadRequestException("Ce Absent n'existe pas");
    }
    const updatedAbsent = await this.absentRepository.save(updateAbsentDto);
    return this.absentRepository.findOne({
      where: { id: updatedAbsent.id },
      relations: ['absentUser', 'replaceUser'],
    });
  }

  async remove(id: number) {
    const { affected } = await this.absentRepository.delete(id);
    if (affected === 0) {
      throw new BadRequestException("Ce Absent n'existe pas");
    }
    return id;
  }
  
  async getAbsent(absentId?: number) {
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
        return found ? { ...absent, replaceUser: found.replaceUser } : absent;
      });
    }
  
    // If absentId is provided, filter absents to return only the absent with the matching ID
    if (absentId) {
      const foundAbsent = absentsWithReplaceUser.find(absent => absent.id === absentId);
      return foundAbsent ? [foundAbsent] : [];
    }
  
    return absentsWithReplaceUser;
  }
  

  async getAllAbsents() {
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
        return found ? { ...absent, replaceUser: found.replaceUser } : absent;
      });
    }

    return absentsWithReplaceUser;
  }
}
