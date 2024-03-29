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
import { MessageCategory } from '../../message-categories/entities/message-category.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  body: string;

  @ManyToOne(() => MessageCategory, (messageCategory) => messageCategory.messages)
  category: MessageCategory;

  @OneToMany(() => Attachment, (attachment) => attachment.message, { nullable: true, cascade: true })
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

  @ManyToMany(() => User, (user) => user.readMessages)
  @JoinTable()
  readBy: User[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
