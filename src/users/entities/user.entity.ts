import {
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
import { Group } from 'src/groups/entities/group.entity';
import { Agent } from 'src/agent/entities/agent.entity';
import { AbsenceSession } from 'src/absences/entities/absence-session.entity';
import { Absence } from 'src/absences/entities/absence.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  disabled: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  lastConnection: Date;

  @ManyToOne(() => Role)
  @Transform(({ value }) => value.name)
  role: Role;

  @Column({ nullable: true })
  profileImage: string;

  @OneToOne(() => Director, (director) => director.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  director: Director;

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

  @OneToOne(() => Agent, (agent) => agent.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  agent: Agent;

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @ManyToMany(() => Message, (message) => message.recipients)
  receivedMessages: Message[];

  @ManyToMany(() => Message, (message) => message.starredBy)
  starredMessages: Message[];

  @ManyToMany(() => Message, (message) => message.readBy)
  readMessages: Message[];

  @OneToMany(() => Absence, (absence) => absence.absentUser)
  absences: Absence[];

  @ManyToMany(() => Group, (group) => group.users)
  groups: Group[];

  @ManyToMany(() => Group, (group) => group.administratorUsers)
  administratorGroups: Group[];

  @OneToMany(() => AbsenceSession, (session) => session.user)
  absenceSessions: AbsenceSession[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   const salt = await bcrypt.genSalt();

  //   this.password = await bcrypt.hash(this.password, salt);
  // }
}