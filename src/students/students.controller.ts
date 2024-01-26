import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Public } from 'src/common/decorators/public_route.decorator';
import { Check } from 'typeorm';
import { CheckPolicies } from 'src/casl/guards/policies.guard';
import { ManageTeachersPolicyHandler } from 'src/casl/policies/teachers/manage-teachers.policy';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @CheckPolicies(new ManageTeachersPolicyHandler())
  create(@Body() createStudentDto: CreateStudentDto, @Body('create-account') createAccount: boolean){
    return this.studentsService.create(createStudentDto, createAccount);}

  @Get()
  @CheckPolicies(new ManageTeachersPolicyHandler())
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManageTeachersPolicyHandler())
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
