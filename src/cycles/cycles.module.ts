import { Module } from '@nestjs/common';
import { CyclesController } from './cycles.controller';
import { CyclesService } from './cycles.service';
import { CaslModule } from 'src/casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cycle } from './entities/cycle.entity';
import { LevelsModule } from 'src/levels/levels.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cycle]), CaslModule, LevelsModule],
  controllers: [CyclesController],
  providers: [CyclesService],
})
export class CyclesModule {}