import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { CaslModule } from 'src/casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), CaslModule, MessagesModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
