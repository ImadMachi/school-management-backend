import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { CsvParserService } from './csv-parser.service';
import { ParentsService } from 'src/parents/parents.service';
import { CreateParentDto } from 'src/parents/dto/create-parent.dto';
import { CyclesService } from 'src/cycles/cycles.service';
import { LevelsService } from 'src/levels/levels.service';
import { ClassesService } from 'src/classes/classes.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private dataSource: DataSource,
    private userService: UsersService,
    private parentService: ParentsService,
    private cycleService: CyclesService,
    private levelService: LevelsService,
    private classService: ClassesService,
    private readonly csvParserService: CsvParserService,
  ) {}

  async create(createStudentDto: CreateStudentDto, createAccount: boolean, file: Express.Multer.File, isImporting: boolean = false) {
    let student: Student;
    try {
      const { createUserDto, ...studentDto } = createStudentDto;

      if (isImporting) {
        const existingStudent = await this.studentRepository.findOne({ where: { identification: studentDto.identification } });
        if (existingStudent) {
          return existingStudent;
        }
      }

      student = this.studentRepository.create(studentDto);
      await this.studentRepository.save(student);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForStudent(createUserDto, student, file);
        student.user = user;
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
    return this.findOne(student.id);
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
      .leftJoinAndSelect('student.parent', 'parent', 'parent.disabled = :disabled', { disabled: false })
      .leftJoinAndSelect('student.user', 'user')
      .andWhere('student.disabled = :disabled', { disabled: false })
      .getMany();
  }

  findStudentsByParent(parentId: number) {
    return this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.parent', 'parent')
      .where('parent.id = :parentId', { parentId })
      .leftJoinAndSelect('student.user', 'user')
      .getMany();
  }

  // findOne(id: number) {
  //   return this.studentRepository.findOne({
  //     where: { id },
  //     relations: ['classe', 'parent'],
  //   });
  // }

  findOne(id: number) {
    return (
      this.studentRepository
        .createQueryBuilder('student')
        .where('student.id = :id', { id })
        .leftJoinAndSelect('student.classe', 'classe')
        .leftJoinAndSelect('student.parent', 'parent', 'parent.disabled = :disabled', { disabled: false })
        // .leftJoinAndSelect('student.user', 'user')
        // .andWhere((qb: SelectQueryBuilder<Student>) => {
        //   qb.where('user.disabled = :disabled', { disabled: false }).orWhere('user.id IS NULL');
        // })
        .andWhere('student.disabled = :disabled', { disabled: false })
        .getOne()
    );
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

  async updateStudentStatus(id: number, disabled: boolean, authUser: User): Promise<Student> {
    const student = await this.findOne(id);
    if (!student) {
      throw new NotFoundException('User not found');
    }

    if (student.user) {
      const user = await this.userService.findOne(student.user.id);
      await this.userService.updateUserStatus(user.id, true, authUser);
    }

    student.parent = null;

    student.disabled = disabled;

    return this.studentRepository.save(student);
  }

  async nullifyParent(id: number): Promise<Student> {
    const student = await this.findOne(id);
    if (!student) {
      throw new NotFoundException('User not found');
    }

    student.parent = null;

    return this.studentRepository.save(student);
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

  // async createAll(students: CreateStudentDto[]) {
  //   const createdStudents = [];

  //   for (const student of students) {
  //     const createdStudent = await this.create(student, false, null);
  //     createdStudents.push(createdStudent);
  //   }

  //   return createdStudents;
  // }

  async importStudents(csvfile: Express.Multer.File) {
    if (!csvfile) {
      throw new HttpException('No file uploaded', 400);
    }
    const data = await this.csvParserService.parseCsv(csvfile.buffer);

    const students = [];
    for (const studentData of data) {
      try {
        // Create DTOs
        const studentDto = { firstName: studentData['PRENOM'], lastName: studentData['NOM'], identification: studentData['Code National'] };
        const parentDto = {
          fatherFirstName: studentData['PRENOM PERE'],
          fatherLastName: studentData['NOM PERE'],
          fatherPhoneNumber: studentData['TEL PERE'],
          motherFirstName: studentData['PRENOM MERE'],
          motherLastName: studentData['NOM MERE'],
          motherPhoneNumber: studentData['TEL MERE'],
        };
        const cycle = { name: studentData['CYCLE'] };
        const level = { name: studentData['NIVEAU'] };
        const classe = {
          name: `${level.name}-${studentData['GROUPE']}`,
          schoolYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        };

        // Create Parent and ParentUser
        const createdParent = await this.parentService.create(parentDto as CreateParentDto, false, null, true);
        try {
          await this.userService.createForParent(
            { email: this.generateEmail(parentDto.fatherLastName, parentDto.fatherFirstName), password: '123456' } as CreateUserDto,
            createdParent,
            null,
          );
        } catch (e) {
          console.error(e);
        }

        // Create Student and StudentUser
        const createdStudent = await this.create(
          { ...studentDto, parent: createdParent } as unknown as CreateStudentDto,
          false,
          null,
          true,
        );
        students.push(createdStudent);
        try {
          await this.userService.createForStudent(
            { email: this.generateEmail(studentData['NOM'], studentData['PRENOM']), password: '123456' } as CreateUserDto,
            createdStudent,
            null,
          );
        } catch (e) {
          console.error(e);
        }

        // Create Cycles
        const createdCycle = await this.cycleService.create(cycle, true);

        // Create Levels
        const createdLevel = await this.levelService.create({ ...level, cycle: createdCycle }, true);

        // Create Classes
        const createdClass = await this.classService.create({ ...classe, level: createdLevel } as any, true);
        await this.classService.addStudentToClass(createdClass.id, createdStudent.id);
      } catch (error) {
        console.error(error);
      }
    }
    return students;
  }

  private generateEmail(lastName: string, firstName: string): string {
    const cleanedLastName = this.cleanString(lastName).toLowerCase();
    const cleanedFirstName = this.cleanString(firstName).toLowerCase();

    return `${cleanedLastName}.${cleanedFirstName}@arganier.com`;
  }

  private cleanString(str: string): string {
    return str.replace(/[^\x00-\x7F]/g, '').replace(/ /g, '');
  }
}
