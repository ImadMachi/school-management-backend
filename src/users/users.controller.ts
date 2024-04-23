import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ReadUsersPolicyHandler } from 'src/casl/policies/users/read-users.policy';
import { RoleName } from 'src/auth/enums/RoleName';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @CheckPolicies(new ReadUsersPolicyHandler())
  findAll(@Query('role') role: string = '') {
    return this.usersService.findAll(role as RoleName);
  }

  @Get(':id')
  @CheckPolicies(new ReadUsersPolicyHandler())
  findOneByrole(@Param('id') id: string, @Query('role') role: string = '') {
    return this.usersService.findOneByrole(+id, role as RoleName);
  }

  @Delete(':id')
  @CheckPolicies(new ReadUsersPolicyHandler())
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post(':id/update-profile-image')
  @UseInterceptors(FileInterceptor('profile-images'))
  async uploadProfileImage(@Param('id') id: number, @UploadedFile() file: Express.Multer.File): Promise<User> {
    const user: User = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.usersService.uploadProfileImage(file, user);
    return user;
  }

  @Post(':id/change-password')
  async changePassword(@Param('id') id: number, @Body('newPassword') newPassword: string): Promise<void> {
    try {
      await this.usersService.changePassword(id, newPassword);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }
  @Put(':id/status')
  async updateUserStatus(@Param('id') userId: number, @Body('disabled') disabled: boolean) {
    return this.usersService.updateUserStatus(userId, disabled);
  }
}
