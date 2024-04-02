import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAbsentDto } from './dto/create-absent.dto';
import { UpdateAbsentDto } from './dto/update-absent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Absent } from './entities/absent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AbsentService {
  constructor(
    @InjectRepository(Absent)
    private absentRepository: Repository<Absent>,
  ) {}

  async create(createAbsentDto: CreateAbsentDto) {
    const newAbsent = await this.absentRepository.save(createAbsentDto);
    return this.absentRepository.findOne({
      where: { id: newAbsent.id },
      relations: ['absentUser', 'replaceUser'],
    });
  }

  async update(updateAbsentDto: UpdateAbsentDto) {
    const absentToUpdate = await this.absentRepository.findOne({
      where: { id: updateAbsentDto.id },
    });
    if (!absentToUpdate) {
      throw new BadRequestException("Cette user n'existe pas");
    }
    const updatedAbsent = await this.absentRepository.save(updateAbsentDto);
    return this.absentRepository.findOne({
      where: { id: updatedAbsent.id },
      relations: ['absentUser', 'replaceUser'],
    });
  }

  async remove(id: number) {
    const { affected } = await this.absentRepository.delete(id);
    if (affected === 0) {
      throw new BadRequestException("Cette classe n'existe pas");
    }
    return id;
  }

  findAll() {
    return this.absentRepository.find({
      relations: ['absentUser', 'replaceUser'],
    });
  }
}
