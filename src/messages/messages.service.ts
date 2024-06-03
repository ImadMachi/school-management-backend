import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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
import { ContactAdministrationDto } from './dto/contact-administration.dto';
import { ForwardMessageDto } from './dto/forward-message.dto';
import { ContactGroupAdministratorDto } from './dto/contact-group-administrator.dto';
import { GroupsService } from 'src/groups/groups.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
    private messageCategoryService: MessageCategoriesService,
    private usersService: UsersService,
    private groupsService: GroupsService,
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

  async contactAdministration(user: User, contactAdministrationDto: ContactAdministrationDto) {
    const directorUser = await this.usersService.findDirectorForUser(user.id);
    return this.createMessage(
      {
        subject: contactAdministrationDto.subject,
        body: contactAdministrationDto.body,
        recipients: [{ id: directorUser.id }],
        categoryId: 1,
        parentMessage: { id: null },
      },
      user,
      [],
    );
  }

  async contactGroupAdministrator(user: User, contactGroupAdministratorDto: ContactGroupAdministratorDto) {
    const group = await this.groupsService.findOne(contactGroupAdministratorDto.groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.createMessage(
      {
        subject: contactGroupAdministratorDto.subject,
        body: contactGroupAdministratorDto.body,
        recipients: group.administratorUsers.map((au) => ({ id: au.id })),
        categoryId: 1,
        parentMessage: { id: null },
      },
      user,
      [],
    );
  }

  async getMessage(id: number, userId: number) {
    const message = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.id = :id', { id })
      .innerJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.director', 'director')
      .leftJoinAndSelect('sender.administrator', 'administrator')
      .leftJoinAndSelect('sender.teacher', 'teacher')
      .leftJoinAndSelect('sender.agent', 'agent')
      .leftJoinAndSelect('sender.student', 'student')
      .leftJoinAndSelect('sender.parent', 'parent')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .leftJoinAndSelect('message.readBy', 'readBy')
      .leftJoinAndSelect('message.starredBy', 'starredBy')
      .leftJoinAndSelect('message.parentMessage', 'parentMessage')
      .leftJoinAndSelect('message.category', 'category')
      .innerJoinAndSelect('sender.role', 'role')
      .getOne();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const isRead = message.readBy.some((u) => u.id === userId);
    const isStarred = message.starredBy.some((u) => u.id === userId);
    delete message.readBy;
    delete message.starredBy;
    return { ...message, isRead, isStarred };
  }

  async getMessagesByFolder(
    userId: number,
    folder: string,
    timestamp?: string,
    categoryId?: number,
    groupId?: number,
    text?: string,
    limit = 10,
    offset = 0,
  ) {
    const queryBuilder = this.messageRepository.createQueryBuilder('message').leftJoinAndSelect('message.starredBy', 'starredBy');

    if (timestamp) {
      queryBuilder.andWhere('message.createdAt > :timestamp', { timestamp: new Date(timestamp) });
    }

    if (limit) {
      queryBuilder.take(limit);
    }
    if (offset) {
      queryBuilder.skip(offset);
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (folder === MailFolder.Sender) {
      queryBuilder.innerJoinAndSelect('message.sender', 'sender').andWhere('sender.id = :userId', { userId });
    } else if (folder === MailFolder.Recipients) {
      queryBuilder
        .innerJoin('message.recipients', 'recipient')
        .andWhere('recipient.id = :userId', { userId })
        .innerJoinAndSelect('message.sender', 'sender');
    } else if (folder === MailFolder.StarredBy) {
      queryBuilder.andWhere('starredBy.id = :userId', { userId }).innerJoinAndSelect('message.sender', 'sender');
    }

    if (folder === MailFolder.TrashedBy) {
      queryBuilder.andWhere('message.isDeleted = true').innerJoinAndSelect('message.sender', 'sender');
    } else {
      queryBuilder.andWhere('message.isDeleted = false');
    }

    if (groupId) {
      queryBuilder.leftJoin('message.group', 'group').andWhere('group.id = :groupId', { groupId });
    }

    queryBuilder
      .leftJoinAndSelect('sender.director', 'director')
      .leftJoinAndSelect('sender.administrator', 'administrator')
      .leftJoinAndSelect('sender.teacher', 'teacher')
      .leftJoinAndSelect('sender.agent', 'agent')
      .leftJoinAndSelect('sender.student', 'student')
      .leftJoinAndSelect('sender.parent', 'parent')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .leftJoinAndSelect('message.readBy', 'readBy')
      .innerJoinAndSelect('sender.role', 'role')
      .innerJoinAndSelect('message.category', 'category')
      .leftJoinAndSelect('message.parentMessage', 'parentMessage');

    if (text) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(message.subject) LIKE :text').orWhere('LOWER(message.body) LIKE :text').orWhere('LOWER(sender.email) LIKE :text');
        }),
        { text: `%${text.toLowerCase()}%` },
      );
    }

    queryBuilder.orderBy('message.createdAt', 'DESC');

    const messages = await queryBuilder.getMany();

    return messages.map((message) => {
      const isRead = message.readBy.some((u) => u.id === userId);
      const isStarred = message.starredBy.some((u) => u.id === userId);
      delete message.readBy;
      delete message.starredBy;
      return { ...message, isRead, isStarred };
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
      .leftJoinAndSelect('sender.agent', 'agent')
      .leftJoinAndSelect('sender.student', 'student')
      .leftJoinAndSelect('sender.parent', 'parent')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .leftJoinAndSelect('message.readBy', 'readBy')
      .leftJoinAndSelect('message.starredBy', 'starredBy')
      .innerJoinAndSelect('sender.role', 'role')
      .innerJoinAndSelect('message.category', 'category')
      .leftJoinAndSelect('message.parentMessage', 'parentMessage')
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    return messages.map((message) => {
      const isRead = message.readBy.some((u) => u.id === userId);
      const isStarred = message.starredBy.some((u) => u.id === userId);
      delete message.readBy;
      delete message.starredBy;
      return { ...message, isRead, isStarred };
    });
  }

  getNumberOfUnreadMessagesByGroup(groupId: number, userId: number) {
    return this.messageRepository
      .createQueryBuilder('message')
      .innerJoin('message.recipients', 'recipient')
      .where('recipient.id = :userId', { userId })
      .andWhere('message.groupId = :groupId', { groupId })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('message_users_read_by.messageId')
          .from('message_users_read_by', 'message_users_read_by')
          .where('message_users_read_by.userId = :userId', { userId })
          .getQuery();
        return 'message.id NOT IN ' + subQuery;
      })
      .getCount();
  }

  // async getStudentMessagesByParent(
  //   parentId: number,
  //   folder: string,
  //   timestamp?: string,
  //   categoryId?: number,
  //   text?: string,
  //   limit = 10,
  //   offset = 0,
  // ) {
  //   const parent = await this.parentService.findOne(parentId);
  //   if (!parent) {
  //     throw new NotFoundException('Parent not found');
  //   }

  //   const studentUsersIds = parent.students.map((student) => student.userId);

  //   return Promise.all(
  //     studentUsersIds.map(async (studenUsertId) => {
  //       return {
  //         studentData: await this.usersService.findOne(studenUsertId),
  //         messages: await this.getMessagesByFolder(studenUsertId, folder, timestamp, categoryId, text, limit, offset),
  //       };
  //     }),
  //   );
  // }

  async markMessageAsRead(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({ where: { id: messageId }, relations: ['readBy', 'sender'] });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!message.readBy.some((u) => u.id === userId) && message.sender.id !== userId) {
      message.readBy.push(user);
    }

    await this.messageRepository.save(message);
  }

  async moveMessageToTrash(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    message.isDeleted = true;
    await this.messageRepository.save(message);
  }

  async moveMessageFromTrash(messageId: number, userId: number) {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    message.isDeleted = false;
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

  async forwardMessage(messageId: number, forwardMessageDto: ForwardMessageDto) {
    const message = await this.messageRepository.findOne({ where: { id: messageId }, relations: ['recipients'] });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const recipients = await Promise.all(
      forwardMessageDto.recipients.map(async (recipient) => {
        return this.usersService.findOne(recipient.id);
      }),
    );

    recipients.forEach((recipient) => {
      if (!message.recipients.some((u) => u.id === recipient.id)) {
        message.recipients.push(recipient);
      }
    });

    await this.messageRepository.save(message);

    return this.messageRepository.findOne({ where: { id: message.id }, relations: ['recipients'] });
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
