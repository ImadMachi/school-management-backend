import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}
  @Post()
  create(@Body() createLevelDto: CreateLevelDto) {
    console.log(createLevelDto)
    return this.levelsService.create(createLevelDto);
  }

  @Put()
  update(@Body() updateLevelDto: UpdateLevelDto) {
    return this.levelsService.update(updateLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.levelsService.remove(id);
  }

  @Get()
  findAll() {
    return this.levelsService.findAll();
  }
}
