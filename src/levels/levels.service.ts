import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  async create(createLevelDto: CreateLevelDto) {
    const existingLevel = await this.levelRepository
      .createQueryBuilder('level')
      .where('LOWER(level.name) = LOWER(:name)', { name: createLevelDto.name })
      .getOne();
    if (existingLevel) {
      throw new BadRequestException('Cette niveau existe déjà');
    }
    const newLevel = await this.levelRepository.save(createLevelDto);

    return this.levelRepository.findOne({
      where: { id: newLevel.id },
      relations: ['classes', 'cycle'],
    });
  }

  async update(updateLevelDto: UpdateLevelDto) {
    const levelToUpdate = await this.levelRepository.findOne({
      where: { id: updateLevelDto.id },
    });
    if (!levelToUpdate) {
      throw new BadRequestException("Cette niveau n'existe pas");
    }
    const updatedLevel = await this.levelRepository.save(updateLevelDto);
    return this.levelRepository.findOne({
      where: { id: updatedLevel.id },
      relations: ['classes', 'cycle'],
    });
  }

  async remove(id: number) {
    const { affected } = await this.levelRepository.delete(id);
    if (affected === 0) {
      throw new BadRequestException("Cette niveau n'existe pas");
    }
    return id;
  }

  findAll() {
    return this.levelRepository.find({
      relations: ['classes', 'cycle'],
    });
  }
}
