import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Statistics } from './entities/statistics.entity';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getStatistics(): Promise<Statistics> {
    return this.statisticsService.getStatistics();
  }
}
