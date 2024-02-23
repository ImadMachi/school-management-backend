import { Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ReadUsersPolicyHandler } from 'src/casl/policies/users/read-users.policy';
import { RoleName } from 'src/auth/enums/RoleName';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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

  @Post(':id/upload-profile-image')
  @UseInterceptors(FileInterceptor('profileImage'))
  async uploadProfileImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    const user: User = await this.usersService.findOne(id);
    if (!user) {
      // Handle the error
      console.log('User not found');
    }
    // Call the public wrapper method
    await this.usersService.uploadProfileImage(file, user);
    return user;
  }
}
