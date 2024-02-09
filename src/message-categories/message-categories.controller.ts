import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { MessageCategoriesService } from './message-categories.service';
import { UpdateMessageCategoryDto } from './dto/update-message-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMessageCategoryDto } from './dto/create-message-category.dto';
import { CheckPolicies, PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CreateMessageCategoryPolicyHandler } from 'src/casl/policies/message-categories/create-category-policy-handler.policy';
import { ReadMessageCategoryPolicyHandler } from 'src/casl/policies/message-categories/read-category-policy-handler.policy';

@UseGuards(PoliciesGuard)
@Controller('message-categories')
export class MessageCategoriesController {
  constructor(private readonly messageCategoriesService: MessageCategoriesService) {}

  @Post()
  @CheckPolicies(new CreateMessageCategoryPolicyHandler())
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createMessageCategoryDto: CreateMessageCategoryDto, @UploadedFile() file: Express.Multer.File) {
    return this.messageCategoriesService.create(createMessageCategoryDto, file);
  }

  @Get()
  @CheckPolicies(new ReadMessageCategoryPolicyHandler())
  findAll() {
    return this.messageCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageCategoryDto: UpdateMessageCategoryDto) {
    return this.messageCategoriesService.update(+id, updateMessageCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageCategoriesService.remove(+id);
  }
}
