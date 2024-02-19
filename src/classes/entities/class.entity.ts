import { IsDate } from 'class-validator';
import { Administrator } from 'src/administrators/entities/administrator.entity';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @ManyToOne(() => Administrator, (administrator) => administrator.classes)
  administrator: Administrator;

  @ManyToMany(() => Teacher, (teacher) => teacher.classes)
  @JoinTable()
  teachers: Teacher[];

  @ManyToMany(() => Student, (student) => student.classes)
  @JoinTable()
  students: Student[];
}
