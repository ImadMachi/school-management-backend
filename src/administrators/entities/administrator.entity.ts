import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
