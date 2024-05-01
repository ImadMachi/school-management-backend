import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbsenceDay } from './absence-day.entity';

@Entity()
export class Absence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  reason: string;

  @Column({ nullable: true })
  justified: boolean;

  @ManyToOne(() => User, (user) => user.absences)
  absentUser: User;

  @Column({ type: 'enum', enum: ['not treated', 'treating', 'treated'], default: 'not treated' })
  status: string;

  @OneToMany(() => AbsenceDay, (session) => session.absence)
  absenceDays: AbsenceDay[];
}
