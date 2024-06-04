import { Administrator } from 'src/administrators/entities/administrator.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Student } from 'src/students/entities/student.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  schoolYear: string;

  @Column({ default: false })
  disabled: boolean;

  @ManyToMany(() => Administrator, (administrators) => administrators.classes)
  @JoinTable()
  administrators: Administrator[];

  @ManyToMany(() => Teacher, (teacher) => teacher.classes)
  @JoinTable()
  teachers: Teacher[];

  @OneToMany(() => Student, (student) => student.classe)
  @JoinTable()
  students: Student[];

  @ManyToOne(() => Level, (level) => level.classes)
  level: Level;

  @ManyToMany(() => Subject, (sub) => sub.classes)
  @JoinTable()
  subjects: Subject[];
}
