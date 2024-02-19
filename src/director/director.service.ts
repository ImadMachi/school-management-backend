import { HttpException, Injectable } from '@nestjs/common';
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
        const user = await this.userService.createForDirector(createUserDto, director);
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

  // findOne(id: number) {
  //   return `This action returns a #${id} director`;
  // }

  // update(id: number, updateDirectorDto: UpdateDirectorDto) {
  //   return `This action updates a #${id} director`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} director`;
  // }
}
