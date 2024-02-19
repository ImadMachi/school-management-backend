import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { CaslModule } from 'src/casl/casl.module';
import { Class } from './entities/class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Class]), CaslModule],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
