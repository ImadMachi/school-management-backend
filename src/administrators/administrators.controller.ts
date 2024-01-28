import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ManageAdministratorsPolicyHandler } from 'src/casl/policies/administrators/manage-administrators.policy';
import { ManageTeachersPolicyHandler } from 'src/casl/policies/teachers/manage-teachers.policy';

@Controller('administrators')
@UseGuards(PoliciesGuard)
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) { }

  @Post()
  @CheckPolicies(new ManageAdministratorsPolicyHandler())
  create(@Body() createAdministratorDto: CreateAdministratorDto, @Query('create-account') createAccount: boolean) {
    return this.administratorsService.create(createAdministratorDto, createAccount);
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
  @CheckPolicies(new ManageTeachersPolicyHandler())
  update(
    @Param('id') id: string,
    @Body() updateAdministratorDto: UpdateAdministratorDto
  ) {
    return this.administratorsService.update(+id, updateAdministratorDto);
  }


  @Delete(':id')
  @CheckPolicies(new ManageAdministratorsPolicyHandler())
  remove(@Param('id') id: string) {
    return this.administratorsService.remove(+id);
  }
}
