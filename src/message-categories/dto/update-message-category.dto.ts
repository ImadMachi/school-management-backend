import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageCategoryDto } from './create-message-category.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdateMessageCategoryDto extends PartialType(CreateMessageCategoryDto) {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description: string;
}
