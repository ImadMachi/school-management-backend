import { HttpException, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createTeacherDto: CreateTeacherDto, createAccount: boolean, file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let teacher: Teacher;
    try {
      const { createUserDto, ...TeacherDto } = createTeacherDto;

      teacher = this.teacherRepository.create(TeacherDto);
      await this.teacherRepository.save(teacher);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForTeacher(createUserDto, teacher, file);
        teacher.user = user;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();

    return this.findOne(teacher.id);
  }

  async createAccountForTeacher(id: number, createUserDto: CreateUserDto, file: Express.Multer.File) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });

    if (!teacher) {
      throw new NotFoundException();
    }

    const user = await this.userService.createForTeacher(createUserDto, teacher, file);
    teacher.user = user;
    return this.findOne(teacher.id);
  }

  findAll() {
    return this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where((qb: SelectQueryBuilder<Teacher>) => {
        qb.where('user.disabled = :disabled', { disabled: false }).orWhere('user.id IS NULL');
      })
      .andWhere('teacher.disabled = :disabled', { disabled: false })
      .getMany();
  }

  // findOne(id: number) {
  //   return this.parentRepository.findOne({
  //     where: { id },
  //     relations: ['students'],
  //   });
  // }

  findOne(id: number) {
    return (
      this.teacherRepository
        .createQueryBuilder('teacher')
        .where('teacher.id = :id', { id })
        .leftJoinAndSelect('teacher.user', 'user')
        // .andWhere((qb: SelectQueryBuilder<Student>) => {
        //   qb.where('user.disabled = :disabled', { disabled: false }).orWhere('user.id IS NULL');
        // })
        .andWhere('teacher.disabled = :disabled', { disabled: false })
        .getOne()
    );
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let teacher: Teacher;
    try {
      teacher = await this.teacherRepository.findOne({ where: { id } });
      if (!teacher) {
        throw new NotFoundException();
      }

      this.teacherRepository.merge(teacher, updateTeacherDto);
      await this.teacherRepository.save(teacher);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return this.findOne(teacher.id);
  }

  async updateTeacherStatus(id: number, disabled: boolean, authUser: User): Promise<Teacher> {
    const teacher = await this.findOne(id);

    if (!teacher) {
      throw new NotFoundException('User not found');
    }

    if (teacher.user) {
      const user = await this.userService.findOne(teacher.user.id);
      await this.userService.updateUserStatus(user.id, true, authUser);
    }

    teacher.disabled = disabled;

    return await this.teacherRepository.save(teacher);
  }

  async remove(id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException();
    }
    return this.teacherRepository.delete(id);
  }
}
