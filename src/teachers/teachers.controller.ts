import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ManageTeachersPolicyHandler } from 'src/casl/policies/teachers/manage-teachers.policy';

@Controller('teachers')
@UseGuards(PoliciesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @CheckPolicies(new ManageTeachersPolicyHandler())
  create(@Body() createTeacherDto: CreateTeacherDto, @Body('create-account') createAccount: boolean) {
    return this.teachersService.create(createTeacherDto, createAccount)
  }

  @Get()
  @CheckPolicies(new ManageTeachersPolicyHandler())
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateTeacherDto: UpdateTeacherDto
    ) {
    return this.teachersService.update(+id, updateTeacherDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManageTeachersPolicyHandler())
  remove(@Param('id') id: string) {
    return this.teachersService.remove(+id);
  }
}
