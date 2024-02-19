import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';

@Entity()
export class Administrator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Exclude()
  @OneToOne(() => User, (user) => user.administrator, {
    nullable: true,
    eager: true,
  })
  user: User;

  @OneToMany(() => Class, (cls) => cls.administrator)
  classes: Class[];

  @Expose()
  get userId() {
    return this.user ? this.user.id : null;
  }
}
