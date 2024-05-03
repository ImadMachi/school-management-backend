import { Controller, Get, Post, Body, Param, Delete, Put, Request } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Put()
  update(@Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.classesService.remove(id);
  }

  @Get()
  findAll(@Request() req) {
    return this.classesService.findAll(req.user);
  }
}
