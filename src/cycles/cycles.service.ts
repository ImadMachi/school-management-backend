import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Cycle } from './entities/cycle.entity';

@Injectable()
export class CyclesService {
  constructor(
    @InjectRepository(Cycle)
    private cycleRepository: Repository<Cycle>,
  ) {}

  async create(createCycleDto: CreateCycleDto, isImporting: boolean = false) {
    if (isImporting) {
      const existingCycle = await this.cycleRepository.findOne({ where: { name: createCycleDto.name } });
      if (existingCycle) {
        return existingCycle;
      }
    }
    const newCycle = await this.cycleRepository.save(createCycleDto);
    return this.cycleRepository.findOne({
      where: { id: newCycle.id },
      relations: ['levels'],
    });
  }

  async update(updateCycleDto: UpdateCycleDto) {
    const cycleToUpdate = await this.cycleRepository.findOne({
      where: { id: updateCycleDto.id },
    });
    if (!cycleToUpdate) {
      throw new BadRequestException("Ce cycle n'existe pas");
    }
    const updatedCycle = await this.cycleRepository.save(updateCycleDto);
    return this.cycleRepository.findOne({
      where: { id: updatedCycle.id },
      relations: ['levels'],
    });
  }

  async remove(id: number) {
    const { affected } = await this.cycleRepository.delete(id);
    if (affected === 0) {
      throw new BadRequestException("Ce cycle n'existe pas");
    }
    return id;
  }

  // findAll() {
  //   return this.cycleRepository.find({
  //     relations: ['levels'],
  //   });
  // }

  findAll() {
    const query = this.cycleRepository
      .createQueryBuilder('cycle')
      .leftJoinAndSelect('cycle.levels', 'levels', 'levels.disabled = :disabled', { disabled: false })
      .where((qb: SelectQueryBuilder<Cycle>) => {
        qb.where('cycle.disabled = :disabled', { disabled: false });
      });

    return query.getMany();
  }

  findOne(id: number) {
    return this.cycleRepository.findOne({
      where: { id },
      relations: ['levels'],
    });
  }

  async updateCycleStatus(id: number, disabled: boolean): Promise<Cycle> {
    const cycles = await this.findOne(id);

    if (!cycles) {
      throw new NotFoundException('User not found');
    }

    cycles.disabled = disabled;

    return await this.cycleRepository.save(cycles);
  }
}
