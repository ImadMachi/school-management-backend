import { Module } from '@nestjs/common';
import { MessageCategoriesService } from './message-categories.service';
import { MessageCategoriesController } from './message-categories.controller';
import { MessageCategory } from './entities/message-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([MessageCategory]), CaslModule],
  controllers: [MessageCategoriesController],
  providers: [MessageCategoriesService],
  exports: [MessageCategoriesService],
})
export class MessageCategoriesModule {}
