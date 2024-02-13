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

  async createForTeacher(createUserDto: CreateUserDto, teacher): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Teacher);

    const user = this.usersRepository.create(createUserDto);
    user.teacher = teacher;
    user.role = role;

    return this.create(user);
  }

  async createForStudent(createUserDto: CreateUserDto, student): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Student);

    const user = this.usersRepository.create(createUserDto);
    user.student = student;
    user.role = role;

    return this.create(user);
  }

  async findAll(role: RoleName): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.role', 'role');
    if (Object.values(RoleName).includes(role)) {
      query.where('role.name = :role', { role });
    }
    query.leftJoinAndSelect('user.student', 'student');
    query.leftJoinAndSelect('user.administrator', 'administrator');
    query.leftJoinAndSelect('user.teacher', 'teacher');

    return query.getMany();
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
