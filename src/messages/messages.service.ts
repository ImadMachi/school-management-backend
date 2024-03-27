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
import { UsersService } from 'src/users/users.service';
import { ParentsService } from 'src/parents/parents.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
    private messageCategoryService: MessageCategoriesService,
    private usersService: UsersService,
    private parentService: ParentsService,
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
    return this.getMessage(newMessage.id, user.id);
  }

  async getMessage(id: number, userId: number) {
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
      .leftJoinAndSelect('message.readBy', 'readBy')
      .leftJoinAndSelect('message.starredBy', 'starredBy')
      .leftJoinAndSelect('message.trashedBy', 'trashedBy')
      .innerJoinAndSelect('sender.role', 'role')
      .getOne();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const isRead = message.readBy.some((u) => u.id === userId);
    const isStarred = message.starredBy.some((u) => u.id === userId);
    const isTrashed = message.trashedBy.some((u) => u.id === userId);
    delete message.readBy;
    delete message.starredBy;
    delete message.trashedBy;
    return { ...message, isRead, isStarred, isTrashed };
  }

  async getMessagesByFolder(userId: number, folder: string, timestamp?: string) {
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.starredBy', 'starredBy')
      .leftJoinAndSelect('message.trashedBy', 'trashedBy');

    if (timestamp) {
      queryBuilder.andWhere('message.createdAt > :timestamp', { timestamp: new Date(timestamp) });
    }

    // if (folder != MailFolder.TrashedBy) {
    //   queryBuilder.andWhere('trashedBy.id = :userId', { userId });
    // }

    if (folder === MailFolder.Sender) {
      queryBuilder.innerJoinAndSelect('message.sender', 'sender').andWhere('sender.id = :userId', { userId });
    } else if (folder === MailFolder.Recipients) {
      queryBuilder
        .innerJoin('message.recipients', 'recipient')
        .andWhere('recipient.id = :userId', { userId })
        .innerJoinAndSelect('message.sender', 'sender');
    } else if (folder === MailFolder.StarredBy) {
      queryBuilder.andWhere('starredBy.id = :userId', { userId }).innerJoinAndSelect('message.sender', 'sender');
    } else if (folder === MailFolder.TrashedBy) {
      queryBuilder.andWhere('trashedBy.id = :userId', { userId }).innerJoinAndSelect('message.sender', 'sender');
    }

    const messages = await queryBuilder
      .leftJoinAndSelect('sender.director', 'director')
      .leftJoinAndSelect('sender.administrator', 'administrator')
      .leftJoinAndSelect('sender.teacher', 'teacher')
      .leftJoinAndSelect('sender.student', 'student')
      .leftJoinAndSelect('sender.parent', 'parent')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .leftJoinAndSelect('message.readBy', 'readBy')
      .innerJoinAndSelect('sender.role', 'role')
      .innerJoinAndSelect('message.category', 'category')
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    return messages.map((message) => {
      const isRead = message.readBy.some((u) => u.id === userId);
      const isStarred = message.starredBy.some((u) => u.id === userId);
      const isTrashed = message.trashedBy.some((u) => u.id === userId);
      delete message.readBy;
      delete message.starredBy;
      delete message.trashedBy;
      return { ...message, isRead, isStarred, isTrashed };
    });
  }

  async getNewMessages(timestamp: string, userId: number) {
    const queryBuilder = this.messageRepository.createQueryBuilder('message');
    const messages = await queryBuilder
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
      .leftJoinAndSelect('message.readBy', 'readBy')
      .leftJoinAndSelect('message.starredBy', 'starredBy')
      .leftJoinAndSelect('message.trashedBy', 'trashedBy')
      .innerJoinAndSelect('sender.role', 'role')
      .innerJoinAndSelect('message.category', 'category')
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    return messages.map((message) => {
      const isRead = message.readBy.some((u) => u.id === userId);
      const isStarred = message.starredBy.some((u) => u.id === userId);
      const isTrashed = message.trashedBy.some((u) => u.id === userId);
      delete message.readBy;
      delete message.starredBy;
      delete message.trashedBy;
      return { ...message, isRead, isStarred, isTrashed };
    });
  }

  async getStudentMessagesByParent(parentId: number) {
    const parent = await this.parentService.findOne(parentId);
    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    const studentUsersIds = parent.students.map((student) => student.userId);

    return Promise.all(
      studentUsersIds.map(async (studenUsertId) => {
        return {
          studentData: await this.usersService.findOne(studenUsertId),
          messages: await this.getMessagesByFolder(studenUsertId, MailFolder.Recipients),
        };
      }),
    );
  }

  async markMessageAsRead(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({ where: { id: messageId }, relations: ['readBy'] });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!message.readBy.some((u) => u.id === userId)) {
      message.readBy.push(user);
    }

    await this.messageRepository.save(message);
  }

  async markMessageAsStarred(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({ where: { id: messageId }, relations: ['starredBy'] });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!message.starredBy.some((u) => u.id === userId)) {
      message.starredBy.push(user);
    }

    await this.messageRepository.save(message);
  }

  async markMessageAsUnstarred(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({ where: { id: messageId }, relations: ['starredBy'] });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    message.starredBy = message.starredBy.filter((u) => u.id !== userId);

    await this.messageRepository.save(message);
  }

  async moveMessageToTrash(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({ where: { id: messageId }, relations: ['trashedBy'] });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!message.trashedBy.some((u) => u.id === userId)) {
      message.trashedBy.push(user);
    }

    await this.messageRepository.save(message);
  }

  async moveMessageFromTrash(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({ where: { id: messageId }, relations: ['trashedBy'] });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    message.trashedBy = message.trashedBy.filter((u) => u.id !== userId);

    await this.messageRepository.save(message);
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
