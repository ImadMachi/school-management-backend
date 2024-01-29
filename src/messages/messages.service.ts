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

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto, user: User, files: Array<Express.Multer.File>) {
    const message = this.messageRepository.create({
      ...createMessageDto,
      sender: user,
    });

    if (files?.length > 0) {
      const attachments = await this.saveAttachments(files);
      message.attachments = attachments;
    }

    return this.messageRepository.save(message);
  }

  async getMessage(id: number) {
    const message = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.id = :id', { id })
      .innerJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.administrator', 'administrator')
      .leftJoinAndSelect('sender.teacher', 'teacher')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .innerJoinAndSelect('sender.role', 'role')
      .getOne();

    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async getMessagesByFolder(userId: number, folder: string) {
    const queryBuilder = this.messageRepository.createQueryBuilder('message');

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
      .leftJoinAndSelect('sender.administrator', 'administrator')
      .leftJoinAndSelect('sender.teacher', 'teacher')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .innerJoinAndSelect('sender.role', 'role')
      .orderBy('message.createdAt', 'DESC')
      .getMany();
  }

  // async getSentMessagesByUser(userId: number): Promise<Message[]> {
  //   return this.messageRepository
  //     .createQueryBuilder('message')
  //     .innerJoin('message.sender', 'sender')
  //     .where('sender.id = :userId', { userId })
  //     .innerJoinAndSelect('message.sender', 'sender')
  //     .leftJoinAndSelect('sender.administrator', 'administrator')
  //     .leftJoinAndSelect('sender.teacher', 'teacher')
  //     .leftJoinAndSelect('message.attachments', 'attachments')
  //     .innerJoinAndSelect('sender.role', 'role')
  //     .orderBy('message.createdAt', 'DESC')
  //     .getMany();
  // }

  // async getReceivedMessagesByUser(userId: number): Promise<Message[]> {
  //   return this.messageRepository
  //     .createQueryBuilder('message')
  //     .innerJoin('message.recipients', 'recipient')
  //     .where('recipient.id = :userId', { userId })
  //     .innerJoinAndSelect('message.sender', 'sender')
  //     .leftJoinAndSelect('sender.administrator', 'administrator')
  //     .leftJoinAndSelect('sender.teacher', 'teacher')
  //     .leftJoinAndSelect('message.attachments', 'attachments')
  //     .innerJoinAndSelect('sender.role', 'role')
  //     .orderBy('message.createdAt', 'DESC')
  //     .getMany();
  // }

  // async getStarredMessagesByUser(userId: number): Promise<Message[]> {
  //   return this.messageRepository
  //     .createQueryBuilder('message')
  //     .innerJoin('message.starredBy', 'starredBy')
  //     .where('starredBy.id = :userId', { userId })
  //     .innerJoinAndSelect('message.sender', 'sender')
  //     .leftJoinAndSelect('sender.administrator', 'administrator')
  //     .leftJoinAndSelect('sender.teacher', 'teacher')
  //     .leftJoinAndSelect('message.attachments', 'attachments')
  //     .innerJoinAndSelect('sender.role', 'role')
  //     .orderBy('message.createdAt', 'DESC')
  //     .getMany();
  // }

  private async saveAttachments(files: Array<Express.Multer.File>) {
    return Promise.all(
      files.map(async (file) => {
        const filename = file.originalname;
        const fileHash = this.generateRandomHash() + filename;

        const execpath = path.join(__dirname, '..', '..', 'attachments', fileHash);
        const filepath = path.join('attachments', fileHash);

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
