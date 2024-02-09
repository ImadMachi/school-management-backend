import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filepath: string;

  @Column()
  filename: string;

  @ManyToOne(() => Message, (message) => message.attachments, { onDelete: 'CASCADE' })
  message: Message;
}
