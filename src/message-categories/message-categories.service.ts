import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { CreateMessageCategoryDto } from './dto/create-message-category.dto';
import { UpdateMessageCategoryDto } from './dto/update-message-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageCategory } from './entities/message-category.entity';
import { Repository } from 'typeorm';
import generateSlug from 'src/common/utils/generate-slug.util';

@Injectable()
export class MessageCategoriesService {
  constructor(
    @InjectRepository(MessageCategory)
    private messageCategoryRepository: Repository<MessageCategory>,
  ) {}

  async create(createMessageCategoryDto: CreateMessageCategoryDto, file: Express.Multer.File) {
    const messageCategory = this.messageCategoryRepository.create({
      ...createMessageCategoryDto,
      slug: generateSlug(createMessageCategoryDto.name),
    });

    if (file) {
      this.uploadImage(file, messageCategory);
    }

    return this.messageCategoryRepository.save(messageCategory);
  }

  findAll() {
    return this.messageCategoryRepository.find({
      where: { isActive: true },
    });
  }

  findOne(id: number) {
    return this.messageCategoryRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async update(id: number, updateMessageCategoryDto: UpdateMessageCategoryDto, file: Express.Multer.File) {
    const messageCategoryToUpdate = await this.messageCategoryRepository.findOne({
      where: { id },
    });
    if (!messageCategoryToUpdate) {
      throw new NotFoundException('Category not found');
    }
    Object.assign(messageCategoryToUpdate, updateMessageCategoryDto);
    messageCategoryToUpdate.slug = generateSlug(updateMessageCategoryDto.name);

    if (file) {
      const oldeImagePath = this.uploadImage(file, messageCategoryToUpdate);
      if (oldeImagePath) {
        this.deleteOldImage(oldeImagePath);
      }
    }

    return this.messageCategoryRepository.save(messageCategoryToUpdate);
  }

  async remove(id: number) {
    const messageCategory = await this.messageCategoryRepository.findOne({
      where: { id },
    });
    if (!messageCategory) {
      throw new NotFoundException('Category not found');
    }
    messageCategory.isActive = false;
    return this.messageCategoryRepository.save(messageCategory);
  }

  private generateRandomHash() {
    return crypto.randomBytes(16).toString('hex');
  }

  uploadImage(file: Express.Multer.File, messageCategory: MessageCategory) {
    const oldImagePath = messageCategory.imagepath;
    const filename = file.originalname;
    const fileHash = this.generateRandomHash() + filename;

    let execpath = '';

    if (process.env.NODE_ENV === 'development') {
      execpath = path.join(__dirname, '..', '..', 'uploads', 'categories-images', fileHash);
    } else {
      execpath = path.join(__dirname, '..', 'uploads', 'categories-images', fileHash);
    }

    const filepath = path.join(fileHash);

    messageCategory.imagepath = filepath;

    fs.writeFileSync(execpath, file.buffer);

    return oldImagePath;
  }

  deleteOldImage(oldImagePath) {
    if (oldImagePath) {
      let oldImageFullPath = '';
      if (process.env.NODE_ENV === 'development') {
        oldImageFullPath = path.join(__dirname, '..', '..', 'uploads', 'categories-images', oldImagePath);
      } else {
        oldImageFullPath = path.join(__dirname, '..', 'uploads', 'categories-images', oldImagePath);
      }

      if (fs.existsSync(oldImageFullPath)) {
        fs.unlinkSync(oldImageFullPath);
      }
    }
  }
}
