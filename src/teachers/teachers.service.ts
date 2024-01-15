import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity'
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherrepository : Repository<Teacher>,
  ){}

  create(createTeacherDto: CreateTeacherDto) {
    const teacher = new Teacher();
    teacher.firstName= createTeacherDto.firstName;
    teacher.lastName=createTeacherDto.lastName;
    teacher.phoneNumber=createTeacherDto.phoneNumber;
    teacher.dateOfBirth=createTeacherDto.dateOfBirth;
    teacher.dateOfEmployment=createTeacherDto.dateOfEmployment;
    teacher.sex=createTeacherDto.sex;
    return this.teacherrepository.save(teacher);
  }

  findAll() {
    return this.teacherrepository.find();
  }

  findOne(id: number) {
    return this.teacherrepository.findOne(id);
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return this.teacherrepository.update(id,updateTeacherDto);
  }

  async remove(id: number) {
    const teacher = await this.teacherrepository.findOne({
      where : {id},
    });
    if(!teacher){
      throw new NotFoundException();
    }
    return this.teacherrepository.delete(id);
  }
}
