import { Controller, Get, Post, Body, Param, Delete, Put, Req, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';

@Controller('absences')
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

  @Post()
  create(@Body() createAbsenceDto: CreateAbsenceDto) {
    return this.absencesService.create(createAbsenceDto);
  }

  @Put()
  update(@Body() updateAbsenceDto: UpdateAbsenceDto) {
    return this.absencesService.update(updateAbsenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.absencesService.remove(id);
  }

  @Get()
  findAll() {
    return this.absencesService.getAllAbsences();
  }

  @Get(':id')
  async getAbsence(@Param('id') id: number, @Req() req) {
    const absence = await this.absencesService.getAbsence(id);
    if (!absence) {
      throw new NotFoundException('Absence record not found');
    }
    return absence;
  }

  // @Get('user/:id/count')
  // async getUserAbsenceStats(@Param('id', ParseIntPipe) id: number) {
  //   return this.absencesService.countUserAbsencesAndReplacements(id);
  // }

  @Get('stats/abs_day')
  async getTotalAbsencesPerDay() {
    return this.absencesService.getTotalAbsencesPerDay();
  }
}