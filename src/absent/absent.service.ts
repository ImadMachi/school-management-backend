import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAbsentDto } from './dto/create-absent.dto';
import { UpdateAbsentDto } from './dto/update-absent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Absent } from './entities/absent.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AbsentService {
  constructor(
    @InjectRepository(Absent)
    private absentRepository: Repository<Absent>,
    private usersSerivce: UsersService,
  ) {}

  async create(createAbsentDto: CreateAbsentDto) {
    const existingAbsent = await this.absentRepository
      .createQueryBuilder('absent')
      .where('absent.absentUser.id = :id', { id: createAbsentDto.absentUser.id })
      .getOne();
    if (existingAbsent) {
      throw new BadRequestException('Cette Absence existe déjà');
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
      throw new BadRequestException("Cette user n'existe pas");
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
      throw new BadRequestException("Cette classe n'existe pas");
    }
    return id;
  }

  findAll() {
    return this.absentRepository.find({
      relations: ['absentUser', 'replaceUser'],
    });
  }

  async getAbsent(absentId: number) {
    const absent = await this.absentRepository
      .createQueryBuilder('absent')
      .where('absent.id = :id', { id: absentId })
      .innerJoinAndSelect('absent.absentUser', 'absentUser')
      .leftJoinAndSelect('absentUser.director', 'director') 
      .leftJoinAndSelect('absentUser.administrator', 'administrator')
      .leftJoinAndSelect('absentUser.teacher', 'teacher')
      .leftJoinAndSelect('absentUser.student', 'student')
      .leftJoinAndSelect('absentUser.parent', 'parent')
      .innerJoinAndSelect('absentUser.role', 'role')
      .leftJoinAndSelect('absent.replaceUser', 'replaceUser') 
      .leftJoinAndSelect('replaceUser.director', 'replaceDirector') 
      .leftJoinAndSelect('replaceUser.administrator', 'replaceAdministrator') 
      .leftJoinAndSelect('replaceUser.teacher', 'replaceTeacher') 
      .leftJoinAndSelect('replaceUser.student', 'replaceStudent') 
      .leftJoinAndSelect('replaceUser.parent', 'replaceParent')
      .innerJoinAndSelect('replaceUser.role', 'replaceRole') 
      .getOne();

    if (!absent) {
      throw new NotFoundException('Absent record not found');
    }

    return {
      ...absent,
    };
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
      .leftJoinAndSelect('absentUser.parent', 'agent')
      .innerJoinAndSelect('absentUser.role', 'role')
      .leftJoinAndSelect('absent.replaceUser', 'replaceUser') 
      .leftJoinAndSelect('replaceUser.director', 'replaceDirector') 
      .leftJoinAndSelect('replaceUser.administrator', 'replaceAdministrator') 
      .leftJoinAndSelect('replaceUser.teacher', 'replaceTeacher') 
      .leftJoinAndSelect('replaceUser.student', 'replaceStudent') 
      .leftJoinAndSelect('replaceUser.parent', 'replaceParent')
      .leftJoinAndSelect('replaceUser.agent', 'replaceAgent')
      .innerJoinAndSelect('replaceUser.role', 'replaceRole') 
      .getMany();

    return absents;
  }

}
