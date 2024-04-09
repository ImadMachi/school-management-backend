import { Module } from '@nestjs/common';
import { AbsentService } from './absent.service';
import { AbsentController } from './absent.controller';
import { Absent } from './entities/absent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { UsersModule } from 'src/users/users.module'; 
import { SubjectModule } from 'src/subjects/subjects.module';

@Module({
  imports: [TypeOrmModule.forFeature([Absent]), CaslModule, UsersModule,CaslModule],
  controllers: [AbsentController],
  providers: [AbsentService],
  exports: [AbsentService],
})
export class AbsentModule {}
