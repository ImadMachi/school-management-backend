import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  dateOfEmployment: Date;

  @Column()
  sex: string;

  @OneToOne(() => User, (user) => user.teacher, { 
    nullable: true, eager: true 
  })
  @Exclude()
  user: User;

  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
