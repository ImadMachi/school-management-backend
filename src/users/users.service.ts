import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['role'] });
  }

  findByEmail(email: string, options = {}): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email }, ...options });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'administrator', 'teacher', 'student'],
    });
  }
}
