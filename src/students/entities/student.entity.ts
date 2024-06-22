import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, ManyToOne } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { Parent } from 'src/parents/entities/parent.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  identification: string;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  sex: string;

  @Column({ default: false })
  disabled: boolean;

  // @Exclude()
  @OneToOne(() => User, (user) => user.student, {
    nullable: true,
    eager: true,
  })
  user: User;

  @ManyToOne(() => Class, (cls) => cls.students)
  classe: Class;

  @ManyToOne(() => Parent, (parent) => parent.students, { nullable: true })
  parent: Parent;

  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
