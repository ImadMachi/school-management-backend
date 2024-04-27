import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createParentDto: CreateParentDto, createAccount: boolean, file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let parent: Parent;
    try {
      const { createUserDto, ...ParentDto } = createParentDto;

      parent = this.parentRepository.create(ParentDto);
      await this.parentRepository.save(parent);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForParent(createUserDto, parent, file);
        parent.user = user;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
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
    return this.parentRepository.createQueryBuilder('parent')
      .leftJoinAndSelect('parent.students', 'students')
      .leftJoinAndSelect('parent.user', 'user')
      .where((qb: SelectQueryBuilder<Parent>) => {
        qb.where('user.disabled = :disabled', { disabled: false })
          .orWhere('user.id IS NULL');
      })
      .andWhere('parent.disabled = :disabled', { disabled: false })
      .getMany();
  }
  
  

  findOne(id: number) {
    return this.parentRepository.findOne({
      where: { id },
      relations: ['students'],
    });
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
    return parent;
  }

  async updateParentStatus(id: number, disabled: boolean): Promise<Parent> {
    const parent = await this.findOne(id);

    if (!parent) {
      throw new NotFoundException('User not found');
    }

    parent.disabled = disabled;

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
}
