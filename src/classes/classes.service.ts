import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RoleName } from 'src/auth/enums/RoleName';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    const existingClass = await this.classRepository
      .createQueryBuilder('class')
      .where('LOWER(class.name) = LOWER(:name)', { name: createClassDto.name })
      .getOne();
    // if (existingClass) {
    //   throw new BadRequestException('Cette classe existe déjà');
    // }
    const newClass = await this.classRepository.save(createClassDto);
    return this.classRepository.findOne({
      where: { id: newClass.id },
      relations: ['administrators', 'teachers', 'students', 'level'],
    });
  }

  async update(updateClassDto: UpdateClassDto) {
    const classToUpdate = await this.classRepository.findOne({
      where: { id: updateClassDto.id },
    });
    if (!classToUpdate) {
      throw new BadRequestException("Cette classe n'existe pas");
    }
    const updatedClass = await this.classRepository.save(updateClassDto);
    return this.classRepository.findOne({
      where: { id: updatedClass.id },
      relations: ['administrators', 'teachers', 'students', 'level'],
    });
  }

  async remove(id: number) {
    const { affected } = await this.classRepository.delete(id);
    if (affected === 0) {
      throw new BadRequestException("Cette classe n'existe pas");
    }
    return id;
  }

  findAll(user: User) {
    const query = this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.administrators', 'administrators', 'administrators.disabled = :disabled', { disabled: false })
      .leftJoinAndSelect('class.teachers', 'teacher', 'teacher.disabled = :disabled', { disabled: false })
      .leftJoinAndSelect('class.students', 'student', 'student.disabled = :disabled', { disabled: false })
      .leftJoinAndSelect('class.level', 'level', 'level.disabled = :disabled', { disabled: false })
      .where((qb: SelectQueryBuilder<Class>) => {
        qb.where('class.disabled = :disabled', { disabled: false });
      });
    if (user.role.name == RoleName.Administrator) {
      query.leftJoinAndSelect('administrators.user', 'user').andWhere('user.id = :userId', { userId: user.id });
    } else if (user.role.name == RoleName.Teacher) {
      query.leftJoinAndSelect('teacher.user', 'user').andWhere('user.id = :userId', { userId: user.id });
    }

    return query.getMany();
  }

  findOne(id: number) {
    return this.classRepository.findOne({
      where: { id },
      relations: ['administrators', 'teachers', 'students', 'level'],
    });
  }

  async updateClasseStatus(id: number, disabled: boolean): Promise<Class> {
    const classes = await this.findOne(id);

    if (!classes) {
      throw new NotFoundException('User not found');
    }

    classes.disabled = disabled;

    return await this.classRepository.save(classes);
  }
}
