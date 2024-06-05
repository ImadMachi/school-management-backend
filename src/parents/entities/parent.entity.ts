import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fatherFirstName: string;

  @Column({ nullable: true })
  fatherLastName: string;

  @Column({ nullable: true })
  fatherPhoneNumber: string;

  @Column({ nullable: true })
  motherFirstName: string;

  @Column({ nullable: true })
  motherLastName: string;

  @Column({ nullable: true })
  motherPhoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: false })
  disabled: boolean;

  // @Exclude()
  @OneToOne(() => User, (user) => user.parent, {
    nullable: true,
    eager: true,
  })
  user: User;

  @OneToMany(() => Student, (student) => student.parent)
  students: Student[];

  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
