import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto, user: User) {
    const message = this.messageRepository.create({
      ...createMessageDto,
      sender: user,
    });
    return this.messageRepository.save(message);
  }

  async getSentMessagesByUser(userId: number): Promise<Message[]> {
    return this.messageRepository.find({ where: { sender: { id: userId } } });
  }

  async getReceivedMessagesByUser(userId: number): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.sender', 'sender')
      .innerJoinAndSelect('sender.role', 'role')
      .leftJoinAndSelect('sender.administrator', 'administrator')
      .leftJoinAndSelect('sender.teacher', 'teacher')

      .innerJoin('message.recipients', 'recipient')
      .where('recipient.id = :userId', { userId })
      .getMany();
  }
}
