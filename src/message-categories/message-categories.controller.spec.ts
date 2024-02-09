import { Test, TestingModule } from '@nestjs/testing';
import { MessageCategoriesController } from './message-categories.controller';
import { MessageCategoriesService } from './message-categories.service';

describe('MessageCategoriesController', () => {
  let controller: MessageCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageCategoriesController],
      providers: [MessageCategoriesService],
    }).compile();

    controller = module.get<MessageCategoriesController>(MessageCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
