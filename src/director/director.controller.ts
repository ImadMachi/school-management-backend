import { Controller, Get, Post, Body, Query, Delete, Patch, Param, UseInterceptors, UploadedFile, Put, Request } from '@nestjs/common';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { CheckPolicies } from 'src/casl/guards/policies.guard';
import { ManageDirectorsPolicyHandler } from 'src/casl/policies/directors/manage-directors.policy';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('directors')
export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profile-images'))
  @CheckPolicies(new ManageDirectorsPolicyHandler())
  create(
    @Body() createDirectorDto: CreateDirectorDto,
    @Query('create-account') createAccount: boolean,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.directorService.create(createDirectorDto, createAccount, file);
  }

  @Post(':id/create-account')
  @UseInterceptors(FileInterceptor('profile-images'))
  @CheckPolicies(new ManageDirectorsPolicyHandler())
  createAccount(@Param('id') id: string, @Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.directorService.createAccountForDirector(+id, createUserDto, file);
  }

  @Get()
  @CheckPolicies(new ManageDirectorsPolicyHandler())
  findAll() {
    return this.directorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directorService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManageDirectorsPolicyHandler())
  update(@Param('id') id: string, @Body() updateDirectorDto: UpdateDirectorDto) {
    return this.directorService.update(+id, updateDirectorDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManageDirectorsPolicyHandler())
  remove(@Param('id') id: string) {
    return this.directorService.remove(+id);
  }

  @Put(':id/status')
  async updateDirectorStatus(@Param('id') id: number, @Body('disabled') disabled: boolean, @Request() req) {
    return this.directorService.updateDirectorStatus(id, disabled, req.user);
  }
}
