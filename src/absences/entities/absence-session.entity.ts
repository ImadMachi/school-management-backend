import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AbsenceDay } from './absence-day.entity';

@Entity()
export class AbsenceSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.absenceSessions)
  user: User;

  @ManyToOne(() => AbsenceDay, (absenceDay) => absenceDay.sessions)
  absenceDay: AbsenceDay;
}
