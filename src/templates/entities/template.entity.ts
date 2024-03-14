import { MessageCategory } from 'src/message-categories/entities/message-category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  subject: string;

  @Column()
  body: string;

  @ManyToOne(() => MessageCategory, (messageCategory) => messageCategory.messages)
  category: MessageCategory;
}
