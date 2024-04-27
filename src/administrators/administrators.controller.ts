import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ManageAdministratorsPolicyHandler } from 'src/casl/policies/administrators/manage-administrators.policy';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('administrators')
@UseGuards(PoliciesGuard)
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profile-images'))
  @CheckPolicies(new ManageAdministratorsPolicyHandler())
  create(
    @Body() createAdministratorDto: CreateAdministratorDto,
    @Query('create-account') createAccount: boolean,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.administratorsService.create(createAdministratorDto, createAccount, file);
  }

  @Post(':id/create-account')
  @UseInterceptors(FileInterceptor('profile-images'))
  @CheckPolicies(new ManageAdministratorsPolicyHandler())
  createAccount(@Param('id') id: string, @Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.administratorsService.createAccoutForAdministrator(+id, createUserDto, file);
  }

  @Get()
  @CheckPolicies(new ManageAdministratorsPolicyHandler())
  findAll() {
    return this.administratorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.administratorsService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManageAdministratorsPolicyHandler())
  update(@Param('id') id: string, @Body() updateAdministratorDto: UpdateAdministratorDto) {
    return this.administratorsService.update(+id, updateAdministratorDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManageAdministratorsPolicyHandler())
  remove(@Param('id') id: string) {
    return this.administratorsService.remove(+id);
  }

  @Put(':id/status')
  async updateAdministratorStatus(@Param('id') id: number, @Body('disabled') disabled: boolean) {
    return this.administratorsService.updateAdministratorStatus(id, disabled);
  }
}
