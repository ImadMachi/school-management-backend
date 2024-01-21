import { HttpException, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity'
import { DataSource, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherrepository: Repository<Teacher>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createTeacherDto: CreateTeacherDto , createAccount: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let teacher: Teacher;
    try {
      const { createUserDto, ...teacherDto } = createTeacherDto;

      teacher = this.teacherrepository.create(teacherDto);
      await this.teacherrepository.save(teacher);

      if(createAccount && createUserDto){
        const user = await this.userService.createForTeacher(createUserDto, teacher);
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

  findAll() {
    return this.teacherrepository.find();
  }

  findOne(id: number) {
    return this.teacherrepository.findOne({
      where :{id}
    });
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return this.teacherrepository.update(id, updateTeacherDto);
  }

  async remove(id: number) {
    const teacher = await this.teacherrepository.findOne({
      where: { id },
    });
    if (!teacher) {
      throw new NotFoundException();
    }
    return this.teacherrepository.delete(id);
  }
}
