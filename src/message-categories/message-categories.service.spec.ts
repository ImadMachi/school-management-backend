import { Test, TestingModule } from '@nestjs/testing';
import { MessageCategoriesService } from './message-categories.service';

describe('MessageCategoriesService', () => {
  let service: MessageCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageCategoriesService],
    }).compile();

    service = module.get<MessageCategoriesService>(MessageCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
