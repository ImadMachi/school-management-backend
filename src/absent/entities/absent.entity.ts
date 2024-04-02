import { Subject } from 'src/subjects/entities/subject.entity';
import { Class } from 'src/classes/entities/class.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Absent {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  @Column()
  hours: string;

  @Column()
  date: Date;

  @Column()
  reason: string;

  @Column()
  justified: boolean;

  @ManyToOne(() => User, (user) => user.absents)
  absentUser: User;

  @ManyToMany(() => User, (user) => user.replacements, {
    nullable: true,
    eager: true,
  })
  @JoinTable()
  replaceUser: User[];

  @ManyToMany(() => Class, (cls) =>cls.absents)
  classes :Class[];

  @ManyToMany(() => Subject, (sub) =>sub.absents)
  subjects :Subject[];

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  status: string;
}
