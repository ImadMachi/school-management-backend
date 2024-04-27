import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Absence } from './absence.entity';
import { AbsenceSession } from './absence-session.entity';

@Entity()
export class AbsenceDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => Absence, (absence) => absence.absenceDays)
  absence: Absence;

  @OneToMany(() => AbsenceSession, (session) => session.absenceDay)
  sessions: AbsenceSession[];
}
