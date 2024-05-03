import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { Subject } from 'src/subjects/entities/subject.entity';

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

  @Column({ default: false })
  disabled: boolean;

  @Exclude()
  @OneToOne(() => User, (user) => user.teacher, {
    nullable: true,
    eager: true,
  })
  user: User;

  @ManyToMany(() => Class, (cls) => cls.teachers)
  classes: Class[];

  
  @Exclude()
  @ManyToMany(() => Subject, (subject) => subject.teachers)
  subjects: Subject[];


  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
