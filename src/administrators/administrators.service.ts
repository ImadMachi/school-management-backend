import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { profile } from 'console';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdministratorsService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createAdministratorDto: CreateAdministratorDto, createAccount: boolean, file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let administrator: Administrator;
    try {
      const { createUserDto, ...administratorDto } = createAdministratorDto;

      administrator = this.administratorRepository.create(administratorDto);

      await this.administratorRepository.save(administrator);
      // await queryRunner.manager.save(Administrator, administrator);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForAdministrator(createUserDto, administrator, file, queryRunner.manager);
        administrator.user = user;
      }

      await queryRunner.manager.save(Administrator, administrator);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return this.findOne(administrator.id);
  }

  async createAccoutForAdministrator(id: number, createUserDto: CreateUserDto, file: Express.Multer.File) {
    const administrator = await this.administratorRepository.findOne({ where: { id } });

    if (!administrator) {
      throw new NotFoundException();
    }

    const user = await this.userService.createForAdministrator(createUserDto, administrator, file, null);
    administrator.user = user;
    return administrator;
  }

  findAll() {
    return this.administratorRepository
      .createQueryBuilder('administrator')
      .leftJoinAndSelect('administrator.user', 'user')
      .andWhere('administrator.disabled = :disabled', { disabled: false })
      .getMany();
  }

  findOne(id: number) {
    return this.administratorRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let administrator: Administrator;
    try {
      administrator = await this.administratorRepository.findOne({ where: { id } });
      if (!administrator) {
        throw new NotFoundException();
      }

      this.administratorRepository.merge(administrator, updateAdministratorDto);
      await this.administratorRepository.save(administrator);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return administrator;
  }

  async updateAdministratorStatus(id: number, disabled: boolean, authUser: User): Promise<Administrator> {
    const administrator = await this.findOne(id);

    if (!administrator) {
      throw new NotFoundException('User not found');
    }

    if (administrator.user) {
      const user = await this.userService.findOne(administrator.user.id);
      await this.userService.updateUserStatus(user.id, true, authUser);
    }

    administrator.disabled = disabled;

    return await this.administratorRepository.save(administrator);
  }

  async remove(id: number) {
    const administrator = await this.administratorRepository.findOne({
      where: { id },
    });

    if (!administrator) {
      throw new NotFoundException();
    }
    return this.administratorRepository.delete(id);
  }
}
