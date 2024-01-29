import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attachment } from './attachment.entity';
import { Expose } from 'class-transformer';

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

  @ManyToMany(() => User, (user) => user.starredMessages)
  @JoinTable()
  starredBy: User[];

  @ManyToMany(() => User, (user) => user.trashMessages)
  @JoinTable()
  trashedBy: User[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
