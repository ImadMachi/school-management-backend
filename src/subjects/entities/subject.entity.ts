import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  disabled: boolean;

  // @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  // @JoinTable()
  // teachers: Teacher[];
}
