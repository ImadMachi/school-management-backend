import { Absent } from 'src/absent/entities/absent.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  @JoinTable()
  teachers: Teacher[];

  @ManyToMany(() => Class, (cls) => cls.subjects)
  @JoinTable()
  classes: Class[];

  @ManyToMany(() => Absent, (absent) => absent.subjects)
  @JoinTable()
  absents: Absent[];

}
