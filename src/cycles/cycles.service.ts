import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cycle } from './entities/cycle.entity';

@Injectable()
export class CyclesService {
  constructor(
    @InjectRepository(Cycle)
    private cycleRepository: Repository<Cycle>,
  ) {}
  
  async create(createCycleDto: CreateCycleDto) {
    const existingCycle = await this.cycleRepository
      .createQueryBuilder('cycle')
      .where('LOWER(cycle.name) = LOWER(:name)', { name: createCycleDto.name })
      .getOne();
    if (existingCycle) {
      throw new BadRequestException('Ce cycle existe déjà');
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

  findAll() {
    return this.cycleRepository.find({
      relations: ['levels'],
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} level`;
  // }

}
