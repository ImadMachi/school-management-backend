import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Absent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  datedebut: Date;

  @Column({ nullable: true })
  datefin: Date;

  @Column()
  reason: string;

  @Column({ nullable: true })
  justified: boolean;

  @ManyToOne(() => User, (user) => user.absents)
  absentUser: User;

  @ManyToMany(() => User, (user) => user.replacements, {
    nullable: true,
    eager: true,
  })
  @JoinTable()
  replaceUser: User[];

  @Column('simple-array')
  seances: string[];

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  status: string;
}
