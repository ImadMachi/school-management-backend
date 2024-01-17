import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { RoleName } from 'src/auth/enums/RoleName';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RolesService,
  ) {}

  async create(user: User): Promise<User> {
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    return this.usersRepository.save(user);
  }

  async createForAdministrator(createUserDto: CreateUserDto, administrator): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Administrator);

    const user = this.usersRepository.create(createUserDto);
    user.administrator = administrator;
    user.role = role;

    return this.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['role', 'administrator', 'teacher', 'student'],
    });
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
