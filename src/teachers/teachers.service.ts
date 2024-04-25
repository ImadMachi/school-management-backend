import { HttpException, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createTeacherDto: CreateTeacherDto, createAccount: boolean , file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let teacher: Teacher;
    try {
      const { createUserDto, ...teacherDto } = createTeacherDto;

      teacher = this.teacherRepository.create(teacherDto);
      await this.teacherRepository.save(teacher);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForTeacher(createUserDto, teacher , file);
        teacher.user = user;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return teacher;
  }

  async createAccountForTeacher(id: number, createUserDto: CreateUserDto, file: Express.Multer.File) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });

    if (!teacher) {
      throw new NotFoundException();
    }

    const user = await this.userService.createForTeacher(createUserDto, teacher , file);
    teacher.user = user;
    return teacher;
  }
  

  findAll() {
    return this.teacherRepository.find({
      relations: ['user'],
      where: {
        user: {
          disabled: false,
        },
      },

  });
}


  findOne(id: number) {
    return this.teacherRepository.findOne({
      where: { id },
    });
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

      // Update the teacher entity with the new data
      this.teacherRepository.merge(teacher, updateTeacherDto);
      await this.teacherRepository.save(teacher);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return teacher;
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
