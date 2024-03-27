import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  imagePath: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.administratorGroups)
  @JoinTable()
  administratorUsers: User[];

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users: User[];
}
