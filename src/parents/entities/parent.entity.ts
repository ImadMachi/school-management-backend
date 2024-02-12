import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
  @Column()
  phoneNumber: string;

  @OneToOne(() => User, (user) => user.administrator, {
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
