import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ReadUsersPolicyHandler } from 'src/casl/policies/users/read-users.policy';

@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CheckPolicies(new ReadUsersPolicyHandler())
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  @CheckPolicies(new ReadUsersPolicyHandler())
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
