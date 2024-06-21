import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Repository, DataSource } from 'typeorm';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    private dataSource: DataSource,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const existingSubject = await this.subjectRepository
        .createQueryBuilder('subject')
        .where('LOWER(subject.name) = LOWER(:name)', { name: createSubjectDto.name })
        .getOne();
        
      if (existingSubject) {
        throw new BadRequestException('Subject already exists');
      }

      // const teachers = await this.dataSource.getRepository(Teacher).findByIds(createSubjectDto.teachers.map(t => t.id));
      // if (teachers.length !== createSubjectDto.teachers.length) {
      //   throw new BadRequestException('One or more teacher IDs are invalid');
      // }

      const newSubject = this.subjectRepository.create({
        ...createSubjectDto,
        // teachers,
      });
      await this.subjectRepository.save(newSubject);
      
      await queryRunner.commitTransaction();
      return this.subjectRepository.findOne({
        where: { id: newSubject.id },
        relations: ['teachers'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(updateSubjectDto: UpdateSubjectDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const subjectToUpdate = await this.subjectRepository.findOne({
        where: { id: updateSubjectDto.id },
      });
      if (!subjectToUpdate) {
        throw new NotFoundException('Subject not found');
      }

      //const teachers = await this.dataSource.getRepository(Teacher).findByIds(updateSubjectDto.teachers.map(t => t.id));
      // if (teachers.length !== updateSubjectDto.teachers.length) {
      //   throw new BadRequestException('One or more teacher IDs are invalid');
      // }

      this.subjectRepository.merge(subjectToUpdate, {
        ...updateSubjectDto,
        // teachers,
      });
      await this.subjectRepository.save(subjectToUpdate);
      
      await queryRunner.commitTransaction();
      return this.subjectRepository.findOne({
        where: { id: subjectToUpdate.id },
        relations: ['teachers'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { affected } = await this.subjectRepository.delete(id);
      if (affected === 0) {
        throw new NotFoundException('Subject not found');
      }
      
      await queryRunner.commitTransaction();
      return id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.subjectRepository.find({
      relations: ['teachers'],
    });
  }

  findOne(id: number) {
    return this.subjectRepository.findOne({
      where: { id },
      relations: ['teachers'],
    });
  }

  async updateSubjectStatus(id: number, disabled: boolean): Promise<Subject> {
    const subject = await this.findOne(id);

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    subject.disabled = disabled;
    return this.subjectRepository.save(subject);
  }
}
