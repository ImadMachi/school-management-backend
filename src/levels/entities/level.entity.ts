import { Class } from 'src/classes/entities/class.entity';
import { Cycle } from 'src/cycles/entities/cycle.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Level {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Cycle, (cycle) => cycle.levels)
  cycle: Cycle;

  @OneToMany(() => Class, (classes) => classes.level)
  classes: Class[];
}
