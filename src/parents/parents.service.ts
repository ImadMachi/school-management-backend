import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createParentDto: CreateParentDto, createAccount: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let parent: Parent;
    try {
      const { createUserDto, ...ParentDto } = createParentDto;

      parent = this.parentRepository.create(ParentDto);
      await this.parentRepository.save(parent);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForParent(createUserDto, parent);
        parent.user = user;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return Parent;
  }

  findAll() {
    return this.parentRepository.find();
  }

  findOne(id: number) {
    return this.parentRepository.findOne({
      where: { id }
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
    return Parent;
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
