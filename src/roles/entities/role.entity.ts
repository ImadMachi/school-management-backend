import { RoleName } from '../../auth/enums/RoleName';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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
