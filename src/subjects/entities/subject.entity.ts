import { Class } from 'src/classes/entities/class.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.classes)
  @JoinTable()
  teachers: Teacher[];

  @ManyToOne(() => Level, (level) => level.classes)
  classes: Class[];
}
