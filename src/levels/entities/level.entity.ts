import { Class } from 'src/classes/entities/class.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Level {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  schoolYear: string;

  @OneToMany(() => Class, (classEntity) => classEntity.level)
  classes: Class[];
}
