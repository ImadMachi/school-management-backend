import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
