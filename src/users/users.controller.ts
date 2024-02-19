import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ReadUsersPolicyHandler } from 'src/casl/policies/users/read-users.policy';
import { RoleName } from 'src/auth/enums/RoleName';

@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @CheckPolicies(new ReadUsersPolicyHandler())
  findAll(@Query('role') role: string = '') {
    return this.usersService.findAll(role as RoleName);
  }

  @Delete(':id')
  @CheckPolicies(new ReadUsersPolicyHandler())
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
