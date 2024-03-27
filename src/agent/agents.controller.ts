import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { ManageAgentsPolicyHandler } from 'src/casl/policies/agents/manage-agents-policy';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('agents')
@UseGuards(PoliciesGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('profile-images'))
  @CheckPolicies(new ManageAgentsPolicyHandler())
  create(@Body() createAgentDto: CreateAgentDto, @Query('create-account') createAccount: boolean, @UploadedFile() file: Express.Multer.File){
    return this.agentsService.create(createAgentDto, createAccount, file);
  }

  @Get()
  @CheckPolicies(new ManageAgentsPolicyHandler())
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManageAgentsPolicyHandler())
  update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto
  ) {
    return this.agentsService.update(+id, updateAgentDto);
  }


  @Delete(':id')
  @CheckPolicies(new ManageAgentsPolicyHandler())
  remove(@Param('id') id: string) {
    return this.agentsService.remove(+id);
  }
}
