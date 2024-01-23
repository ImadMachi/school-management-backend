import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attachment } from './attachment.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  body: string;

  @OneToMany(() => Attachment, (attachment) => attachment.message, { nullable: true })
  attachments: Attachment[];

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  @ManyToMany(() => User, (user) => user.receivedMessages)
  @JoinTable()
  recipients: User[];
}
