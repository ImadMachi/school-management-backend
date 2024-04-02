import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => User, (user) => user.agent, {
    nullable: true,
    eager: true,
  })
  @Exclude()
  user: User;

  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
