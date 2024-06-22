import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Class } from 'src/classes/entities/class.entity';

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

  @Column()
  subjects: string;

  @Column({ default: false })
  disabled: boolean;

  // @Exclude()
  @OneToOne(() => User, (user) => user.teacher, {
    nullable: true,
    eager: true,
  })
  user: User;

  // @ManyToMany(() => Subject, (subject) => subject.teachers)
  // @JoinTable()
  // subjects: Subject[];


  @ManyToMany(() => Class, (cls) => cls.teachers)
  classes: Class[];

  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
