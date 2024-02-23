import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entities/director.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DirectorService {
  constructor(
    @InjectRepository(Director)
    private directorRepository: Repository<Director>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createDirectorDto: CreateDirectorDto, createAccount: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let director: Director;
    try {
      const { createUserDto, ...directorDto } = createDirectorDto;

      director = this.directorRepository.create(directorDto);
      await this.directorRepository.save(director);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForDirector(createUserDto, director );
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

  findAll() {
    return this.directorRepository.find();
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
