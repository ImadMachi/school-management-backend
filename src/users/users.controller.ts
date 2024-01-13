import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { Public } from 'src/common/decorators/public_route.decorator';
import { ReadUsersPolicyHandler } from 'src/casl/policies/read-users.policy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadUsersPolicyHandler())
  @Public()
  findAll() {
    return this.usersService.findAll();
  }
}
