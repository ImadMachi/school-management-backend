import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Put } from '@nestjs/common';
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
  findAll() {
    return this.messageCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.messageCategoriesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: number, @Body() updateMessageCategoryDto: UpdateMessageCategoryDto, @UploadedFile() file: Express.Multer.File) {
    return this.messageCategoriesService.update(id, updateMessageCategoryDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.messageCategoriesService.remove(id);
  }
}
