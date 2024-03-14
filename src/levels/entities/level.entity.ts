import { Class } from 'src/classes/entities/class.entity';
import { Cycle } from 'src/cycles/entities/cycle.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Level {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  schoolYear: string;

  @OneToMany(() => Class, (classes) => classes.level)
  @JoinTable()
  classes: Class[];

  @ManyToOne(() => Cycle, (cycle) => cycle.levels)
  cycle: Cycle;
  
}
