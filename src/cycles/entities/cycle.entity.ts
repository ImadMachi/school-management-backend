import { Level } from 'src/levels/entities/level.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  disabled: boolean;

  @OneToMany(() => Level, (level) => level.cycle)
  levels: Level[];
}
