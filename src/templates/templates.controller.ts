import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto);
  }

  @Get()
  findAll() {
    return this.templatesService.findAll();
  }

  @Put()
  update(@Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templatesService.update(updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.templatesService.remove(id);
  }
}
