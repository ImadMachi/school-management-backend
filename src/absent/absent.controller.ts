import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, NotFoundException } from '@nestjs/common';
import { AbsentService } from './absent.service';
import { CreateAbsentDto } from './dto/create-absent.dto';
import { UpdateAbsentDto } from './dto/update-absent.dto';

@Controller('absents')
export class AbsentController {
  constructor(private readonly absentService: AbsentService) {}

  @Post()
  create(@Body() createAbsentDto: CreateAbsentDto) {
    return this.absentService.create(createAbsentDto);
  }

  @Put()
  update(@Body() updateAbsentDto: UpdateAbsentDto) {
    return this.absentService.update(updateAbsentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.absentService.remove(id);
  }

  @Get()
  findAll() {
    return this.absentService.getAllAbsents();
  }

  @Get(':id')
  async getAbsent(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    const absent = await this.absentService.getAbsent(id);
    if (!absent) {
      throw new NotFoundException('Absent record not found');
    }
    return absent;
  }
}
