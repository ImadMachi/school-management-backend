import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  disabled: boolean;

  @OneToOne(() => User, (user) => user.parent, {
    nullable: true,
    eager: true,
  })
  @Exclude()
  user: User;

  @OneToMany(() => Student, (student) => student.parent)
  students: Student[];

  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
