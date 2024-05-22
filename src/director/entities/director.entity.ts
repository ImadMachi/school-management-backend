import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Director {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  disabled: boolean;

  // @Exclude()
  @OneToOne(() => User, (user) => user.director, {
    nullable: true,
    eager: true,
  })
  user: User;

  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
