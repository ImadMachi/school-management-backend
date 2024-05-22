import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { ManageParentsPolicyHandler } from 'src/casl/policies/parents/manage-parents-policy';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('parents')
@UseGuards(PoliciesGuard)
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profile-images'))
  @CheckPolicies(new ManageParentsPolicyHandler())
  create(
    @Body() createParentDto: CreateParentDto,
    @Query('create-account') createAccount: boolean,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.parentsService.create(createParentDto, createAccount, file);
  }

  @Get()
  @CheckPolicies(new ManageParentsPolicyHandler())
  findAll() {
    return this.parentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentsService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManageParentsPolicyHandler())
  update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentsService.update(+id, updateParentDto);
  }

  @Post(':id/create-account')
  @UseInterceptors(FileInterceptor('profile-images'))
  @CheckPolicies(new ManageParentsPolicyHandler())
  createAccountForParent(@Param('id') id: string, @Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.parentsService.createAccoutForParent(+id, createUserDto, file);
  }

  @Delete(':id')
  @CheckPolicies(new ManageParentsPolicyHandler())
  remove(@Param('id') id: string) {
    return this.parentsService.remove(+id);
  }

  @Put(':id/status')
  async updateParentStatus(@Param('id') id: number, @Body('disabled') disabled: boolean, @Request() req) {
    return this.parentsService.updateParentStatus(id, disabled, req.user);
  }
}
