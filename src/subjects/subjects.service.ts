import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject  } from './entities/subject.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const existingSubject = await this.subjectRepository
      .createQueryBuilder('subject')
      .where('LOWER(subject.name) = LOWER(:name)', { name: createSubjectDto.name })
      .getOne();
    if (existingSubject) {
      throw new BadRequestException('Cette matière existe déjà');
    }
    const newSubject = await this.subjectRepository.save(createSubjectDto);
    return this.subjectRepository.findOne({
      where: { id: newSubject.id },
      relations: ['teachers','classes'],
    });
  }

  async update(updateSubjectDto: UpdateSubjectDto) {
    const subjectToUpdate = await this.subjectRepository .findOne({
      where: { id: updateSubjectDto.id },
    });
    if (!subjectToUpdate) {
      throw new BadRequestException("Cette matière n'existe pas");
    }
    const updatedSubject = await this.subjectRepository.save(updateSubjectDto);
    return this.subjectRepository.findOne({
      where: { id: updatedSubject.id },
      relations: [ 'teachers','classes'],
    });
  }

  async remove(id: number) {
    const { affected } = await this.subjectRepository.delete(id);
    if (affected === 0) {
      throw new BadRequestException("Cette matière n'existe pas");
    }
    return id;
  }

  // findAll() {
  //   return this.subjectRepository.find({
  //     relations: [ 'teachers','classes'],
  //   });
  // }

  findAll() {
    const query = this.subjectRepository
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.teachers', 'teacher')
      .leftJoinAndSelect('subject.classes', 'class')
      .where((qb: SelectQueryBuilder<Subject>) => {
        qb.where('subject.disabled = :disabled', { disabled: false })
      })     
      .getMany();

    return query;
  }

  findOne(id: number) {
    return this.subjectRepository.findOne({
      where: { id },
      relations: ['teachers','classes'],
    });
  }

  async updateSubjectStatus(id: number, disabled: boolean): Promise<Subject> {
    const subjects = await this.findOne(id);

    if (!subjects) {
      throw new NotFoundException('User not found');
    }

    subjects.disabled = disabled;

    return await this.subjectRepository.save(subjects);
  }


  // findOne(id: number) {
  //   return `This action returns a #${id} class`;
  // }

  // update(id: number, updateClassDto: UpdateClassDto) {
  //   return `This action updates a #${id} class`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} class`;
  // }
}
