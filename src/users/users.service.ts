import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { RoleName } from 'src/auth/enums/RoleName';
import { Director } from 'src/director/entities/director.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RolesService,
  ) {}

  async create(user: User, file: Express.Multer.File): Promise<User> {
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    if (file) {
      const profileImage = await this.saveProfileImage(file, user);
      user.profileImage = profileImage;
      console.log('profileImage', profileImage);
    }

    console.log('user', user);

    return this.usersRepository.save(user);
  }

  async createForDirector(createUserDto: CreateUserDto, director: Director, file: Express.Multer.File) {
    const role = await this.roleService.findByName(RoleName.Director);

    const user = this.usersRepository.create(createUserDto);
    user.director = director;
    user.role = role;

    return this.create(user, file); // Pass null as the second argument
  }

  async createForAdministrator(createUserDto: CreateUserDto, administrator, file: Express.Multer.File): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Administrator);

    const user = this.usersRepository.create(createUserDto);
    user.administrator = administrator;
    user.role = role;
    console.log('user', user);
    console.log('file', file);

    return this.create(user, file);
  }

  async createForTeacher(createUserDto: CreateUserDto, teacher, file: Express.Multer.File): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Teacher);

    const user = this.usersRepository.create(createUserDto);
    user.teacher = teacher;
    user.role = role;

    return this.create(user, file);
  }

  async createForStudent(createUserDto: CreateUserDto, student, file: Express.Multer.File): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Student);

    const user = this.usersRepository.create(createUserDto);
    user.student = student;
    user.role = role;

    return this.create(user, file);
  }
  async createForParent(createUserDto: CreateUserDto, parent, file: Express.Multer.File): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Parent);

    const user = this.usersRepository.create(createUserDto);
    user.parent = parent;
    user.role = role;

    return this.create(user, file); // Pass an empty array as the second argument
  }

  async findAll(role: RoleName): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.role', 'role');
    if (Object.values(RoleName).includes(role)) {
      query.where('role.name = :role', { role });
    }
    query.leftJoinAndSelect('user.student', 'student');
    query.leftJoinAndSelect('user.administrator', 'administrator');
    query.leftJoinAndSelect('user.teacher', 'teacher');
    query.leftJoinAndSelect('user.parent', 'parent');
    query.leftJoinAndSelect('user.director', 'director');

    return query.getMany();
  }

  findByEmail(email: string, options = {}): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email }, ...options });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'administrator', 'teacher', 'student', 'parent', 'director'],
    });
  }

  async findOneByrole(id: number, role: RoleName): Promise<User | null> {
    const query = this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.role', 'role').where('user.id = :id', { id });

    if (Object.values(RoleName).includes(role)) {
      query.andWhere('role.name = :role', { role });
    }

    query.leftJoinAndSelect('user.student', 'student');
    query.leftJoinAndSelect('user.administrator', 'administrator');
    query.leftJoinAndSelect('user.teacher', 'teacher');
    query.leftJoinAndSelect('user.parent', 'parent');
    query.leftJoinAndSelect('user.director', 'director');

    return query.getOne();
  }

  async remove(id: number): Promise<User | null> {
    const userToDelete = await this.usersRepository.findOne({
      where: { id },
    });
    if (!userToDelete) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // Manually delete related messages
    this.usersRepository.delete(id);

    return userToDelete;
  }

  public async saveProfileImage(file: Express.Multer.File, user: User) {
    const filename = file.originalname;
    const fileHash = this.generateRandomHash() + filename;

    const execpath = path.join(__dirname, '..', '..', 'uploads', 'profileImage', fileHash);
    const filepath = path.join('profileImage', fileHash);

    user.profileImage = filepath;

    fs.writeFileSync(execpath, file.buffer);

    await this.usersRepository.save(user);

    console.log('Profile image saved');

    return user.profileImage;
  }

  public async uploadProfileImage(file: Express.Multer.File, user: User): Promise<string> {
    return this.saveProfileImage(file, user);
  }

  private generateRandomHash() {
    return crypto.randomBytes(16).toString('hex');
  }
}
