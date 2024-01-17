import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { RoleName } from 'src/auth/enums/RoleName';

@Injectable()
export class AdministratorsService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createAdministratorDto: CreateAdministratorDto, createAccount: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let administrator: Administrator;
    try {
      const { createUserDto, ...administratorDto } = createAdministratorDto;

      administrator = this.administratorRepository.create(administratorDto);
      await this.administratorRepository.save(administrator);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForAdministrator(createUserDto, administrator);
        administrator.user = user;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return administrator;
  }

  findAll() {
    return this.administratorRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} administrator`;
  }

  update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    return `This action updates a #${id} administrator`;
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
