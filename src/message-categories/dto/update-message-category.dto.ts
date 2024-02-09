import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageCategoryDto } from './create-message-category.dto';

export class UpdateMessageCategoryDto extends PartialType(CreateMessageCategoryDto) {}
