import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put } from '@nestjs/common';
import { SubjectsService} from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    console.log(createSubjectDto)
    return this.subjectsService.create(createSubjectDto);
  }

  @Put()
  update(@Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.subjectsService.remove(id);
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

}
