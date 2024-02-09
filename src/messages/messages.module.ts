import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { CaslModule } from 'src/casl/casl.module';
import { MessageCategoriesModule } from 'src/message-categories/message-categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Attachment]), CaslModule, MessageCategoriesModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
