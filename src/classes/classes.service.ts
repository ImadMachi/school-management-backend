import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    const existingClass = await this.classRepository
      .createQueryBuilder('class')
      .where('LOWER(class.name) = LOWER(:name)', { name: createClassDto.name })
      .getOne();
    if (existingClass) {
      throw new BadRequestException('Cette classe existe déjà');
    }
    const newClass = await this.classRepository.save(createClassDto);
    return this.classRepository.findOne({
      where: { id: newClass.id },
      relations: ['administrator', 'teachers', 'students', 'level', 'subjects'],
    });
  }

  async update(updateClassDto: UpdateClassDto) {
    const classToUpdate = await this.classRepository.findOne({
      where: { id: updateClassDto.id },
    });
    if (!classToUpdate) {
      throw new BadRequestException("Cette classe n'existe pas");
    }
    const updatedClass = await this.classRepository.save(updateClassDto);
    return this.classRepository.findOne({
      where: { id: updatedClass.id },
      relations: ['administrator', 'teachers', 'students', 'level', 'subjects'],
    });
  }

  async remove(id: number) {
    const { affected } = await this.classRepository.delete(id);
    if (affected === 0) {
      throw new BadRequestException("Cette classe n'existe pas");
    }
    return id;
  }

  findAll() {
    return this.classRepository.find({
      relations: ['administrator', 'teachers', 'students', 'level', 'subjects'],
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} class`;
  // }

  // update(id: number, updateClassDto: UpdateClassDto) {
  //   return `This action updates a #${id} class`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} class`;
  // }
}
