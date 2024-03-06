import {
  Admin,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';
import { Administrator } from '../../administrators/entities/administrator.entity';
import { Exclude, Transform } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import { Message } from '../../messages/entities/message.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Director } from 'src/director/entities/director.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role)
  @Transform(({ value }) => value.name)
  role: Role;

  @OneToOne(() => Director, (director) => director.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  director: Director;

  @Column({ nullable: true })
  profileImage: string;

  @OneToOne(() => Administrator, (administrator) => administrator.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  administrator: Administrator;

  @OneToOne(() => Teacher, (teacher) => teacher.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  teacher: Teacher;

  @OneToOne(() => Student, (student) => student.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: Student;

  @OneToOne(() => Parent, (parent) => parent.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  parent: Parent;

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @ManyToMany(() => Message, (message) => message.recipients)
  receivedMessages: Message[];

  @ManyToMany(() => Message, (message) => message.starredBy)
  starredMessages: Message[];

  @ManyToMany(() => Message, (message) => message.trashedBy)
  trashMessages: Message[];

  @ManyToMany(() => Message, (message) => message.readBy)
  readMessages: Message[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
