import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { Director } from './entities/director.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Director]), CaslModule, UsersModule],
  controllers: [DirectorController],
  providers: [DirectorService],
})
export class DirectorModule {}
