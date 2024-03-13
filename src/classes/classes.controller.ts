import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    console.log(createClassDto)
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
  findAll() {
    return this.classesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.classesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
  //   return this.classesService.update(+id, updateClassDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.classesService.remove(+id);
  // }
}
