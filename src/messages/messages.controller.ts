import { Body, Controller, Get, Param, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ManageMessagesPolicyHandler } from 'src/casl/policies/messages/manage-messages.policy';
import { QueryFolderDto } from './dto/query-folder.dto';

@Controller('messages')
@UseGuards(PoliciesGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  createMessage(@Body() createMessageDto: CreateMessageDto, @Request() req, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.messagesService.createMessage(createMessageDto, req.user, files);
  }

  @Get('user/:userId')
  @CheckPolicies(new ManageMessagesPolicyHandler())
  getMessagesByUser(@Param('userId') userId: number, @Query() query: QueryFolderDto) {
    return this.messagesService.getMessagesByFolder(userId, query.folder);
  }

  @Get('auth')
  getAuthenticatedUserMessages(@Request() req, @Query() query: QueryFolderDto) {
    return this.messagesService.getMessagesByFolder(req.user.id, query.folder);
  }

  @Get(':id')
  getMessage(@Param('id') id: number) {
    return this.messagesService.getMessage(id);
  }
}
