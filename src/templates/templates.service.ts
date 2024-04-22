import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './entities/template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto) {
    const template = new Template();
    Object.assign(template, createTemplateDto);
    await this.templateRepository.save(template);
    return this.findOne(template.id);
  }

  findOne(id: number) {
    return this.templateRepository.findOne({ where: { id }, relations: ['category'] });
  }

  findAll() {
    return this.templateRepository.find({
      relations: ['category'],
    });
  }

  async update(updateTemplateDto: UpdateTemplateDto) {
    const id = updateTemplateDto.id;
    const templateToUpdate = this.templateRepository.findOne({ where: { id } });
    if (!templateToUpdate) {
      throw new NotFoundException(`Template #${id} not found`);
    }
    return this.templateRepository.save(updateTemplateDto);
  }

  remove(id: number) {
    const templateToRemove = this.templateRepository.findOne({ where: { id } });
    if (!templateToRemove) {
      throw new NotFoundException(`Template #${id} not found`);
    }
    return this.templateRepository.delete(id);
  }
}
