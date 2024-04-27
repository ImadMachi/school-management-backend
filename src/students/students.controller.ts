import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CheckPolicies } from 'src/casl/guards/policies.guard';
import { ManageStudentsPolicyHandler } from 'src/casl/policies/students/manage-students-policy';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profile-images'))
  @CheckPolicies(new ManageStudentsPolicyHandler())
  create(
    @Body() createStudentDto: CreateStudentDto,
    @Query('create-account') createAccount: boolean,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.studentsService.create(createStudentDto, createAccount, file);
  }

  @Post(':id/create-account')
  @UseInterceptors(FileInterceptor('profile-images'))
  @CheckPolicies(new ManageStudentsPolicyHandler())
  createAccount(@Param('id') id: string, @Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.studentsService.createAccountForStudent(+id, createUserDto, file);
  }

  @Get()
  @CheckPolicies(new ManageStudentsPolicyHandler())
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('parent/:parentId')
  findStudentsByParent(@Param('parentId') parentId: number) {
    return this.studentsService.findStudentsByParent(parentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManageStudentsPolicyHandler())
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManageStudentsPolicyHandler())
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
