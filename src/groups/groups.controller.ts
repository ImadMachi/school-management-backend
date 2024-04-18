import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CheckPolicies } from 'src/casl/guards/policies.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  // @CheckPolicies(new CreateGroupPolicyHandler())
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createGroupDto: CreateGroupDto, @UploadedFile() file: Express.Multer.File) {
    return this.groupsService.create(createGroupDto, file);
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get('user/:userId')
  getGroupsByUser(@Param('userId') userId: number) {
    return this.groupsService.getGroupsByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.groupsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto, @UploadedFile() file: Express.Multer.File) {
    return this.groupsService.update(id, updateGroupDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.groupsService.remove(id);
  }
}
