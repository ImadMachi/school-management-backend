import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { RoleName } from 'src/auth/enums/RoleName';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createStudentDto: CreateStudentDto, createAccount: boolean, file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let student: Student;
    try {
      const { createUserDto, ...studentDto } = createStudentDto;

      student = this.studentRepository.create(studentDto);
      await this.studentRepository.save(student);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForStudent(createUserDto, student, file);
        student.user = user;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return this.findOne(student.id);
    //return student;
  }

  async createAccountForStudent(id: number, createUserDto: CreateUserDto, file: Express.Multer.File) {
    const student = await this.studentRepository.findOne({ where: { id } });

    if (!student) {
      throw new NotFoundException();
    }

    const user = await this.userService.createForStudent(createUserDto, student, file);
    student.user = user;
    return this.findOne(student.id);
  }

  findAll() {
    return this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.classe', 'classe')
      .leftJoinAndSelect('student.father', 'father')
      .leftJoinAndSelect('student.mother', 'mother')
      .leftJoinAndSelect('student.user', 'user')
      .where((qb: SelectQueryBuilder<Student>) => {
        qb.where('user.disabled = :disabled', { disabled: false }).orWhere('user.id IS NULL');
      })
      .andWhere('student.disabled = :disabled', { disabled: false })
      .getMany();
  }

  findStudentsByParent(parentId: number) {
    return this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.father', 'father')
      .where('father.id = :parentId', { parentId })
      .leftJoin('student.mother', 'mother')
      .where('mother.id = :parentId', { parentId })
      .leftJoinAndSelect('student.user', 'user')
      .getMany();
  }

  findOne(id: number) {
    return this.studentRepository.findOne({
      where: { id },
      relations: ['classe', 'father', 'mother'],
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
    return this.findOne(student.id);
  }

  async updateStudentStatus(id: number, disabled: boolean): Promise<Student> {
    const student = await this.findOne(id);

    if (!student) {
      throw new NotFoundException('User not found');
    }

    student.disabled = disabled;

    return await this.studentRepository.save(student);
  }

  async remove(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException();
    }
    return this.studentRepository.delete(id);
  }
}
