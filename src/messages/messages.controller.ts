import { Body, Controller, Delete, Get, Param, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ManageMessagesPolicyHandler } from 'src/casl/policies/messages/manage-messages.policy';
import { GetMessageQueryDto } from './dto/get-message-query.dto';
import { ContactAdministrationDto } from './dto/contact-administration.dto';

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
  getMessagesByUser(@Param('userId') userId: number, @Query() query: GetMessageQueryDto) {
    const { folder, timestamp, limit, offset, categoryId, groupId, text } = query;
    return this.messagesService.getMessagesByFolder(userId, folder, timestamp, categoryId, groupId, text, limit, offset);
  }

  @Get('auth')
  getAuthenticatedUserMessages(@Request() req, @Query() query: GetMessageQueryDto) {
    const { folder, timestamp, limit, offset, categoryId, userId, text, groupId } = query;

    const userIdToUse = userId || req.user.id;
    return this.messagesService.getMessagesByFolder(userIdToUse, folder, timestamp, categoryId, groupId, text, limit, offset);
  }

  @Get('new')
  getNewMessages(@Request() req, @Query('timestamp') timestamp: string) {
    return this.messagesService.getNewMessages(timestamp, req.user.id);
  }

  @Post('contact-administration')
  contactAdministration(@Request() req, @Body() contactAdministrationDto: ContactAdministrationDto) {
    return this.messagesService.contactAdministration(req.user, contactAdministrationDto);
  }

  @Post(':id/read')
  markMessageAsRead(@Param('id') id: number, @Request() req) {
    return this.messagesService.markMessageAsRead(id, req.user.id);
  }

  @Post(':id/star')
  markMessageAsStarred(@Param('id') id: number, @Request() req) {
    return this.messagesService.markMessageAsStarred(id, req.user.id);
  }

  @Delete(':id/unstar')
  markMessageAsUnstarred(@Param('id') id: number, @Request() req) {
    return this.messagesService.markMessageAsUnstarred(id, req.user.id);
  }

  @Post(':id/trash')
  moveMessageToTrash(@Param('id') id: number, @Request() req) {
    return this.messagesService.moveMessageToTrash(id, req.user.id);
  }

  @Delete(':id/untrash')
  moveMessageFromTrash(@Param('id') id: number, @Request() req) {
    return this.messagesService.moveMessageFromTrash(id, req.user.id);
  }

  // forward a message
  @Get(':id/forward/:userId')
  forwardMessage(@Param('id') id: number, @Param('id') recipientId: number) {
    return this.messagesService.forwardMessage(id, recipientId);
  }

  @Get(':id')
  getMessage(@Param('id') id: number, @Request() req) {
    return this.messagesService.getMessage(id, req.user.id);
  }

  @Get('unread-count/:userId')
  async getNumberOfUnreadMessagesByUser(@Param('userId') userId: number): Promise<number> {
    return this.messagesService.getNumberOfUnreadMessagesByUser(userId);
  }


}
