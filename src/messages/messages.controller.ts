import { Body, Controller, Get, Param, Post, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
const express = require('express');

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('sent/:userId')
  getSentMessagesByUser(@Param('userId') userId: number) {
    return this.messagesService.getSentMessagesByUser(userId);
  }

  @Get('received/:userId')
  getReceivedMessagesByUser(@Param('userId') userId: number) {
    return this.messagesService.getReceivedMessagesByUser(userId);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  createMessage(@Body() createMessageDto: CreateMessageDto, @Request() req, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.messagesService.createMessage(createMessageDto, req.user);
  }
}
