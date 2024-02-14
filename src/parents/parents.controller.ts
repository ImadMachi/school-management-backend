import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { ManageParentsPolicyHandler } from 'src/casl/policies/parents/manage-parents-policy';


@Controller('parents')
@UseGuards(PoliciesGuard)
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) { }

  @Post()
  @CheckPolicies(new ManageParentsPolicyHandler())
  create(@Body() createParentDto: CreateParentDto, @Query('create-account') createAccount: boolean) {
    return this.parentsService.create(createParentDto, createAccount);
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
  update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto
  ) {
    return this.parentsService.update(+id, updateParentDto);
  }


  @Delete(':id')
  @CheckPolicies(new ManageParentsPolicyHandler())
  remove(@Param('id') id: string) {
    return this.parentsService.remove(+id);
  }
}
