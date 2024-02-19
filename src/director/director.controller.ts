import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { CheckPolicies } from 'src/casl/guards/policies.guard';
import { ManageDirectorsPolicyHandler } from 'src/casl/policies/directors/manage-directors.policy';

@Controller('directors')
export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  @Post()
  @CheckPolicies(new ManageDirectorsPolicyHandler())
  create(@Body() createDirectorDto: CreateDirectorDto, @Query('create-account') createAccount: boolean) {
    return this.directorService.create(createDirectorDto, createAccount);
  }

  @Get()
  @CheckPolicies(new ManageDirectorsPolicyHandler())
  findAll() {
    return this.directorService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.directorService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDirectorDto: UpdateDirectorDto) {
  //   return this.directorService.update(+id, updateDirectorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.directorService.remove(+id);
  // }
}
