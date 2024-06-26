import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Student } from 'src/students/entities/student.entity';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createParentDto: CreateParentDto, createAccount: boolean, file: Express.Multer.File, isImporting: boolean = false) {
    let parent: Parent;
    try {
      const { createUserDto, ...ParentDto } = createParentDto;

      if (isImporting) {
        const existingParent = await this.parentRepository.findOne({
          where: {
            fatherFirstName: ParentDto.fatherFirstName,
            fatherLastName: ParentDto.fatherLastName,
            motherFirstName: ParentDto.motherFirstName,
            motherLastName: ParentDto.motherLastName,
          },
        });
        if (existingParent) {
          return existingParent;
        }
      }
      const existingParent = await this.parentRepository.findOne({
        where: {
          fatherFirstName: ParentDto.fatherFirstName,
          fatherLastName: ParentDto.fatherLastName,
          motherFirstName: ParentDto.motherFirstName,
          motherLastName: ParentDto.motherLastName,
        },
      });

      if (existingParent) {
        return this.findOne(existingParent.id);
      }

      parent = this.parentRepository.create(ParentDto);
      await this.parentRepository.save(parent);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForParent(createUserDto, parent, file);
        parent.user = user;
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
    return this.findOne(parent.id);
  }

  async createAccoutForParent(id: number, createUserDto: CreateUserDto, file: Express.Multer.File) {
    const parent = await this.parentRepository.findOne({ where: { id } });

    if (!parent) {
      throw new NotFoundException();
    }

    const user = await this.userService.createForParent(createUserDto, parent, file);
    parent.user = user;
    return this.findOne(parent.id);
  }

  findAll() {
    return this.parentRepository
      .createQueryBuilder('parent')
      .leftJoinAndSelect('parent.students', 'students', 'students.disabled = :disabled', { disabled: false })
      .leftJoinAndSelect('parent.user', 'user')
      .where((qb: SelectQueryBuilder<Parent>) => {
        qb.where('user.disabled = :disabled', { disabled: false }).orWhere('user.id IS NULL');
      })
      .andWhere('parent.disabled = :disabled', { disabled: false })
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
      this.parentRepository
        .createQueryBuilder('parent')
        .where('parent.id = :id', { id })
        .leftJoinAndSelect('parent.students', 'students', 'students.disabled = :disabled', { disabled: false })
        .leftJoinAndSelect('parent.user', 'user')
        // .andWhere((qb: SelectQueryBuilder<Student>) => {
        //   qb.where('user.disabled = :disabled', { disabled: false }).orWhere('user.id IS NULL');
        // })
        .andWhere('parent.disabled = :disabled', { disabled: false })
        .getOne()
    );
  }

  async update(id: number, updateParentDto: UpdateParentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let parent: Parent;
    try {
      parent = await this.parentRepository.findOne({ where: { id } });
      if (!parent) {
        throw new NotFoundException();
      }

      this.parentRepository.merge(parent, updateParentDto);
      await this.parentRepository.save(parent);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return this.findOne(parent.id);
  }

  async updateParentStatus(id: number, disabled: boolean, authUser: User): Promise<Parent> {
    const parent = await this.findOne(id);

    if (!parent) {
      throw new NotFoundException('User not found');
    }

    if (parent.user) {
      const user = await this.userService.findOne(parent.user.id);
      await this.userService.updateUserStatus(user.id, true, authUser);
    }

    // parent students
    for (const student of parent.students) {
      const s = await this.studentRepository.findOne({ where: { id: student.id } });
      student.parent = null;
      await this.studentRepository.save(s);
    }

    parent.disabled = disabled;
    parent.students = [];

    return await this.parentRepository.save(parent);
  }

  async remove(id: number) {
    const parent = await this.parentRepository.findOne({
      where: { id },
    });

    if (!parent) {
      throw new NotFoundException();
    }
    return this.parentRepository.delete(id);
  }

  // async createAll(parents: CreateParentDto[]) {
  //   const createdParents = [];

  //   for (const parent of parents) {
  //     const createdStudent = await this.create(parent, false, null);
  //     createdParents.push(createdStudent);
  //   }

  //   return createdParents;
  // }
}
