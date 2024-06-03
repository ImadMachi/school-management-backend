import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { User } from 'src/users/entities/user.entity';
import { RoleName } from 'src/auth/enums/RoleName';
import { Message } from 'src/messages/entities/message.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(createGroupDto: CreateGroupDto, file: Express.Multer.File) {
    const group = this.groupRepository.create({
      ...createGroupDto,
    });

    if (file) {
      this.uploadImage(file, group);
    }

    const createdGroup = await this.groupRepository.save(group);
    return this.findOne(createdGroup.id);
  }

  async getGroupsByUser(userId: number) {
    const groups = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.isActive = :isActive', { isActive: true })
      .leftJoin('group.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('group.administratorUsers', 'administratorUsers')
      .leftJoinAndSelect('administratorUsers.administrator', 'administrator')
      .getMany();

    for (const group of groups) {
      const unReadMessagesCount = await this.messageRepository
        .createQueryBuilder('message')
        .innerJoin('message.recipients', 'recipient')
        .where('recipient.id = :userId', { userId })
        .andWhere('message.groupId = :groupId', { groupId: group.id })
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
      // @ts-ignore
      group.unReadMessagesCount = unReadMessagesCount;
    }
    // @ts-ignore
    return groups.sort((a, b) => b.unReadMessagesCount - a.unReadMessagesCount);
  }

  findAll(user: User) {
    const query = this.groupRepository
      .createQueryBuilder('group')
      .where('group.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('group.administratorUsers', 'administratorUsers');

    if (user.role.name !== RoleName.Director) {
      query.andWhere('administratorUsers.id = :userId', { userId: user.id });
    }
    return query
      .leftJoinAndSelect('administratorUsers.administrator', 'administrator')
      .leftJoinAndSelect('administratorUsers.role', 'role')
      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('users.director', 'director')
      .leftJoinAndSelect('users.administrator', 'administratorx')
      .leftJoinAndSelect('users.teacher', 'teacher')
      .leftJoinAndSelect('users.student', 'student')
      .leftJoinAndSelect('users.parent', 'parent')
      .leftJoinAndSelect('users.agent', 'agent')
      .leftJoinAndSelect('users.role', 'rolex')
      .getMany();
  }

  findOne(id: number) {
    return this.groupRepository
      .createQueryBuilder('group')
      .where('group.id = :id', { id })
      .andWhere('group.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('group.administratorUsers', 'administratorUsers')
      .leftJoinAndSelect('administratorUsers.administrator', 'administrator')
      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('users.director', 'director')
      .leftJoinAndSelect('users.administrator', 'administratorx')
      .leftJoinAndSelect('users.teacher', 'teacher')
      .leftJoinAndSelect('users.student', 'student')
      .leftJoinAndSelect('users.agent', 'agent')
      .leftJoinAndSelect('users.parent', 'parent')
      .getOne();
  }

  async update(id: number, updateGroupDto: UpdateGroupDto, file: Express.Multer.File) {
    const groupToUpdate = await this.groupRepository.findOne({
      where: { id },
    });
    if (!groupToUpdate) {
      throw new NotFoundException('Category not found');
    }
    Object.assign(groupToUpdate, updateGroupDto);

    if (file) {
      const oldImagePath = this.uploadImage(file, groupToUpdate);
      // if (oldImagePath) {
      //   this.deleteOldImage(oldImagePath);
      // }
    }

    const updatedGroup = await this.groupRepository.save(groupToUpdate);
    return this.findOne(updatedGroup.id);
  }

  async remove(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
    });
    if (!group) {
      throw new NotFoundException('Category not found');
    }
    group.isActive = false;
    return this.groupRepository.save(group);
  }

  private generateRandomHash() {
    return crypto.randomBytes(16).toString('hex');
  }

  uploadImage(file: Express.Multer.File, group: Group) {
    const oldImagePath = group.imagePath;
    const filename = file.originalname;
    const fileHash = this.generateRandomHash() + filename;

    const execpath = path.join(__dirname, '..', '..', 'uploads', 'groups', fileHash);

    const filepath = path.join(fileHash);

    group.imagePath = filepath;

    fs.writeFileSync(execpath, file.buffer);

    return oldImagePath;
  }

  deleteOldImage(oldImagePath) {
    if (oldImagePath) {
      const oldImageFullPath = path.join(__dirname, '..', '..', 'uploads', 'groups', oldImagePath);

      if (fs.existsSync(oldImageFullPath)) {
        fs.unlinkSync(oldImageFullPath);
      }
    }
  }
}
