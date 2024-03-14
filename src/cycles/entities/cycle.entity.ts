import { Level } from 'src/levels/entities/level.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  schoolYear: string;

  @OneToMany(() => Level, (level) => level.cycle)
  @JoinTable()
  levels: Level[];
}
