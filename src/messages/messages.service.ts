import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from 'src/users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Attachment } from './entities/attachment.entity';
import { MailFolder } from './enums/mail-folder.enum';
import { MessageCategoriesService } from 'src/message-categories/message-categories.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
    private messageCategoryService: MessageCategoriesService,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto, user: User, files: Array<Express.Multer.File>) {
    const category = await this.messageCategoryService.findOne(createMessageDto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const message = this.messageRepository.create({
      ...createMessageDto,
      sender: user,
      category,
    });

    if (files?.length > 0) {
      const attachments = await this.saveAttachments(files);
      message.attachments = attachments;
    }

    const newMessage = await this.messageRepository.save(message);
    return this.getMessage(newMessage.id);
  }

  async getMessage(id: number) {
    const message = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.id = :id', { id })
      .innerJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.director', 'director')
      .leftJoinAndSelect('sender.administrator', 'administrator')
      .leftJoinAndSelect('sender.teacher', 'teacher')
      .leftJoinAndSelect('sender.student', 'student')
      .leftJoinAndSelect('sender.parent', 'parent')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .innerJoinAndSelect('sender.role', 'role')
      .getOne();

    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async getMessagesByFolder(userId: number, folder: string, timestamp: string) {
    const queryBuilder = this.messageRepository.createQueryBuilder('message');

    if (timestamp) {
      queryBuilder.where('message.createdAt > :timestamp', { timestamp: new Date(timestamp) });
    }

    if (folder === MailFolder.Sender) {
      queryBuilder.innerJoinAndSelect('message.sender', 'sender').where('sender.id = :userId', { userId });
    } else if (folder === MailFolder.Recipients) {
      queryBuilder
        .innerJoin('message.recipients', 'recipient')
        .where('recipient.id = :userId', { userId })
        .innerJoinAndSelect('message.sender', 'sender');
    } else if (folder === MailFolder.StarredBy) {
      queryBuilder
        .innerJoin('message.starredBy', 'starredBy')
        .where('starredBy.id = :userId', { userId })
        .innerJoinAndSelect('message.sender', 'sender');
    } else if (folder === MailFolder.TrashedBy) {
      queryBuilder
        .innerJoin('message.trashedBy', 'trashedBy')
        .where('trashedBy.id = :userId', { userId })
        .innerJoinAndSelect('message.sender', 'sender');
    }

    return queryBuilder
      .leftJoinAndSelect('sender.director', 'director')
      .leftJoinAndSelect('sender.administrator', 'administrator')
      .leftJoinAndSelect('sender.teacher', 'teacher')
      .leftJoinAndSelect('sender.student', 'student')
      .leftJoinAndSelect('sender.parent', 'parent')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .innerJoinAndSelect('sender.role', 'role')
      .innerJoinAndSelect('message.category', 'category')
      .orderBy('message.createdAt', 'DESC')
      .getMany();
  }

  async getNewMessages(timestamp: string, userId: number) {
    const queryBuilder = this.messageRepository.createQueryBuilder('message');
    queryBuilder
      .innerJoin('message.recipients', 'recipient')
      .where('recipient.id = :userId', { userId })
      .andWhere('message.createdAt > :timestamp', { timestamp: new Date(timestamp) })
      .innerJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.director', 'director')
      .leftJoinAndSelect('sender.administrator', 'administrator')
      .leftJoinAndSelect('sender.teacher', 'teacher')
      .leftJoinAndSelect('sender.student', 'student')
      .leftJoinAndSelect('sender.parent', 'parent')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .innerJoinAndSelect('sender.role', 'role')
      .innerJoinAndSelect('message.category', 'category')
      .orderBy('message.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  private async saveAttachments(files: Array<Express.Multer.File>) {
    return Promise.all(
      files.map(async (file) => {
        const filename = file.originalname;
        const fileHash = this.generateRandomHash() + filename;

        const execpath = path.join(__dirname, '..', '..', 'uploads', 'attachments', fileHash);
        const filepath = path.join(fileHash);

        const attachment = this.attachmentRepository.create({
          filename,
          filepath,
        });

        await this.attachmentRepository.save(attachment);

        fs.writeFileSync(execpath, file.buffer);

        return attachment;
      }),
    );
  }

  private generateRandomHash() {
    return crypto.randomBytes(16).toString('hex');
  }
}
