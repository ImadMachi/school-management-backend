import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdministratorsService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
  ) {}

  create(createAdministratorDto: CreateAdministratorDto) {
    const administrator = this.administratorRepository.create(
      createAdministratorDto,
    );
    return this.administratorRepository.save(administrator);
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
