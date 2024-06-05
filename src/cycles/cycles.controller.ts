import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CyclesService } from './cycles.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';

@Controller('cycles')
export class CyclesController {
  constructor(private readonly cyclesService: CyclesService) {}
  @Post()
  create(@Body() createCycleDto: CreateCycleDto) {
    return this.cyclesService.create(createCycleDto);
  }

  @Put()
  update(@Body() updateCycleDto: UpdateCycleDto) {
    return this.cyclesService.update(updateCycleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cyclesService.remove(id);
  }

  @Get()
  findAll() {
    return this.cyclesService.findAll();
  }

  @Put(':id/status')
  async updateCycleStatus(@Param('id') id: number, @Body('disabled') disabled: boolean) {
    return this.cyclesService.updateCycleStatus(id, disabled);
  }
}
