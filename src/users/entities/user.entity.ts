import {
  Admin,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../auth/entities/role.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';
import { Administrator } from '../../administrators/entities/administrator.entity';
import { Exclude, Expose, Transform } from 'class-transformer';

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

  @OneToOne(() => Administrator, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  administrator: Administrator;

  @OneToOne(() => Teacher, { nullable: true })
  @JoinColumn()
  teacher: Teacher;

  @OneToOne(() => Student, { nullable: true })
  @JoinColumn()
  student: Student;

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
