import { Injectable } from '@nestjs/common';
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
      const filename = file.originalname;
      const fileHash = this.generateRandomHash() + filename;

      const execpath = path.join(__dirname, '..', '..', 'uploads', 'categories-images', fileHash);
      const filepath = path.join(fileHash);

      messageCategory.imagepath = filepath;

      fs.writeFileSync(execpath, file.buffer);
    }

    return this.messageCategoryRepository.save(messageCategory);
  }

  findAll() {
    return this.messageCategoryRepository.find();
  }

  findOne(id: number) {
    return this.messageCategoryRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateMessageCategoryDto: UpdateMessageCategoryDto) {
    return `This action updates a #${id} messageCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageCategory`;
  }

  private generateRandomHash() {
    return crypto.randomBytes(16).toString('hex');
  }
}
