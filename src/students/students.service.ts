import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}
  
  async create(createStudentDto: CreateStudentDto, createAccount: boolean , file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let student: Student;
    try {
      const { createUserDto, ...studentDto } = createStudentDto;
      
      student = this.studentRepository.create(studentDto);
      await this.studentRepository.save(student);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForStudent(createUserDto, student , file);
        student.user = user;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return student;
  }

  findAll() {
    return this.studentRepository.find();
  }

  findOne(id: number) {
    return this.studentRepository.findOne({
      where: { id }
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let student: Student;
    try {
      student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        throw new NotFoundException();
      }

      this.studentRepository.merge(student, updateStudentDto);
      await this.studentRepository.save(student);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return student;
  }

  async remove(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException();
    }
    return this.studentRepository.delete(id);  }
}
