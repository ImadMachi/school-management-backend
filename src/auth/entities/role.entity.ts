import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoleName } from '../enums/RoleName';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleName,
    default: RoleName.Student,
  })
  name: RoleName;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
