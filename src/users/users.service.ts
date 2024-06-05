import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
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

  async create(user: User, file: Express.Multer.File, entityManager: EntityManager): Promise<User> {
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    if (file) {
      const profileImage = await this.saveProfileImage(file, user);
      user.profileImage = profileImage;
    }

    await this.usersRepository.save(user);
    // await entityManager.insert(User, user);

    return this.findOne(user.id);
  }

  async createForDirector(createUserDto: CreateUserDto, director: Director, file: Express.Multer.File) {
    const role = await this.roleService.findByName(RoleName.Director);

    const user = this.usersRepository.create(createUserDto);
    user.director = director;
    user.role = role;

    return this.create(user, file, null);
  }

  async createForAdministrator(
    createUserDto: CreateUserDto,
    administrator,
    file: Express.Multer.File,
    entityManager: EntityManager,
  ): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Administrator);

    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const user = this.usersRepository.create(createUserDto);
    user.administrator = administrator;
    user.role = role;

    return this.create(user, file, entityManager);
  }

  async createForTeacher(createUserDto: CreateUserDto, teacher, file: Express.Multer.File): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Teacher);

    const user = this.usersRepository.create(createUserDto);
    user.teacher = teacher;
    user.role = role;

    return this.create(user, file, null);
  }

  async createForStudent(createUserDto: CreateUserDto, student, file: Express.Multer.File): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Student);

    const user = this.usersRepository.create(createUserDto);
    user.student = student;
    user.role = role;

    return this.create(user, file, null);
  }
  async createForParent(createUserDto: CreateUserDto, parent, file: Express.Multer.File): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Parent);

    const user = this.usersRepository.create(createUserDto);
    user.parent = parent;
    user.role = role;

    return this.create(user, file, null);
  }

  async createForAgent(createUserDto: CreateUserDto, agent, file: Express.Multer.File): Promise<User> {
    const role = await this.roleService.findByName(RoleName.Agent);

    const user = this.usersRepository.create(createUserDto);
    user.agent = agent;
    user.role = role;

    return this.create(user, file, null);
  }

  async findAll(role: RoleName, user: User): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.role', 'role');
    if (Object.values(RoleName).includes(role)) {
      query.where('role.name = :role', { role });
    }
    query
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('student.classe', 'classe')
      .leftJoinAndSelect('classe.level', 'level')
      .leftJoinAndSelect('level.cycle', 'cycle')
      .leftJoinAndSelect('user.administrator', 'administrator')
      .leftJoinAndSelect('user.teacher', 'teacher')
      .leftJoinAndSelect('user.parent', 'parent')
      .leftJoinAndSelect('user.director', 'director')
      .leftJoinAndSelect('user.agent', 'agent')
      .andWhere('user.disabled = :disabled', { disabled: false });

    if (user.role.name === RoleName.Administrator) {
      query
        .leftJoinAndSelect('classe.administrator', 'administratorx')
        .leftJoinAndSelect('administratorx.user', 'userx')
        .leftJoinAndSelect('parent.students', 'studenty')
        .leftJoinAndSelect('studenty.classe', 'classey')
        .leftJoinAndSelect('classey.administrator', 'administratory')
        .leftJoinAndSelect('administratory.user', 'usery')
        .andWhere((qb) => {
          qb.where((qb) => {
            qb.where('userx.id = :userId', { userId: user.id }).andWhere('role.name = :student', { student: RoleName.Student });
          })
            // .orWhere((qb) => {
            //   qb.where('usery.id = :userId', { userId: user.id }).andWhere('role.name = :parent', { parent: RoleName.Parent });
            // })
            .orWhere('role.name NOT IN (:...roles)', { roles: [RoleName.Student /*RoleName.Parent*/] });
        });
    } else if (user.role.name === RoleName.Teacher) {
      query
        .leftJoinAndSelect('classe.administrator', 'administratorx')
        .leftJoinAndSelect('administratorx.user', 'userx')
        .leftJoinAndSelect('parent.students', 'studenty')
        .leftJoinAndSelect('studenty.classe', 'classey')
        .leftJoinAndSelect('classey.teachers', 'teachersy')
        .leftJoinAndSelect('teachersy.user', 'usery')
        .andWhere((qb) => {
          qb.where((qb) => {
            qb.where('userx.id = :userId', { userId: user.id }).andWhere('role.name = :student', { student: RoleName.Student });
          })
            // .orWhere((qb) => {
            //   qb.where('usery.id = :userId', { userId: user.id }).andWhere('role.name = :parent', { parent: RoleName.Parent });
            // })
            .orWhere('role.name NOT IN (:...roles)', { roles: [RoleName.Student /*RoleName.Parent*/] });
        });
    }

    return query.getMany();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, disabled: false },
      relations: ['role', 'administrator', 'teacher', 'student', 'parent', 'director', 'agent'],
    });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'administrator', 'teacher', 'student', 'parent', 'director', 'agent'],
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
    query.leftJoinAndSelect('user.agent', 'agent');

    return query.getOne();
  }

  async getAllDirectors(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: { name: RoleName.Director } },
      relations: ['director'],
    });
  }

  async getAdministratorsOfClasses(user: User): Promise<User[]> {
    if (user.role.name == RoleName.Parent) {
      const administratorUsers = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.administrator', 'administrator')
        .leftJoinAndSelect('administrator.classes', 'classe')
        .leftJoinAndSelect('classe.students', 'student')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('parent.user', 'userx')
        .where('userx.id = :id', { id: user.id })
        .andWhere('role.name = :adminRole', { adminRole: RoleName.Administrator })
        .getMany();

      return administratorUsers;
    }
    return [];
  }

  async remove(id: number): Promise<User | null> {
    const userToDelete = await this.usersRepository.findOne({
      where: { id },
    });
    if (!userToDelete) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.usersRepository.delete(id);

    return userToDelete;
  }

  public async saveProfileImage(file: Express.Multer.File, user: User) {
    const filename = file.originalname;
    const fileHash = this.generateRandomHash() + filename;

    const execpath = path.join(__dirname, '..', '..', 'uploads', 'profile-images', fileHash);

    const filepath = path.join('profile-images', fileHash);

    user.profileImage = filepath;

    fs.writeFileSync(execpath, file.buffer);

    await this.usersRepository.save(user);

    return user.profileImage;
  }

  public async uploadProfileImage(file: Express.Multer.File, user: User): Promise<string> {
    return this.saveProfileImage(file, user);
  }

  async updateUserStatus(userId: number, disabled: boolean, authUser: User): Promise<User> {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id == authUser.id) {
      throw new HttpException('You cannot delete yourself', HttpStatus.FORBIDDEN);
    }

    user.disabled = disabled;

    return await this.usersRepository.save(user);
  }

  async activateAccount(userId: number, authUser: User) {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.disabled = false;

    return this.usersRepository.save(user);
  }

  public async changePassword(id: number, newPassword: string): Promise<void> {
    const user = await this.findOne(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.password = newPassword;
    await this.usersRepository.save(user);
  }

  public async updateLastConnection(id: number): Promise<void> {
    const user = await this.findOne(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.lastConnection = new Date();

    await this.usersRepository.save(user);
  }

  private generateRandomHash() {
    return crypto.randomBytes(16).toString('hex');
  }
}
