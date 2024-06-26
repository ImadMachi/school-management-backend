import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entities/director.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DirectorService {
  constructor(
    @InjectRepository(Director)
    private directorRepository: Repository<Director>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createDirectorDto: CreateDirectorDto, createAccount: boolean, file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let director: Director;
    try {
      const { createUserDto, ...directorDto } = createDirectorDto;

      director = this.directorRepository.create(directorDto);
      await this.directorRepository.save(director);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForDirector(createUserDto, director, file);
        director.user = user;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return director;
  }

  async createAccountForDirector(id: number, createUserDto: CreateUserDto, file: Express.Multer.File) {
    const director = await this.directorRepository.findOne({ where: { id } });

    if (!director) {
      throw new NotFoundException();
    }

    const user = await this.userService.createForDirector(createUserDto, director, file);
    director.user = user;
    return director;
  }

  findAll() {
    return this.directorRepository
      .createQueryBuilder('director')
      .leftJoinAndSelect('director.user', 'user')
      .andWhere('director.disabled = :disabled', { disabled: false })
      .getMany();
  }

  findOne(id: number) {
    return this.directorRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let director: Director;
    try {
      director = await this.directorRepository.findOne({ where: { id } });
      if (!director) {
        throw new NotFoundException();
      }

      this.directorRepository.merge(director, updateDirectorDto);
      await this.directorRepository.save(director);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return director;
  }

  async updateDirectorStatus(id: number, disabled: boolean, authUser: User): Promise<Director> {
    const director = await this.findOne(id);

    if (!director) {
      throw new NotFoundException('User not found');
    }

    if (director.user) {
      const user = await this.userService.findOne(director.user.id);
      await this.userService.updateUserStatus(user.id, true, authUser);
    }

    director.disabled = disabled;

    return await this.directorRepository.save(director);
  }

  async remove(id: number) {
    const director = await this.directorRepository.findOne({
      where: { id },
    });

    if (!director) {
      throw new NotFoundException();
    }
    return this.directorRepository.delete(id);
  }
}
