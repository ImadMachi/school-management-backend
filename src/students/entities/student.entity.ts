import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column()
  sex: string;

  @OneToOne(() => User, (user) => user.student, {
    nullable: true,
    eager: true,
  })
  @Exclude()
  user: User;

  @ManyToMany(() => Class, (cls) => cls.teachers)
  classes: Class[];

  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
