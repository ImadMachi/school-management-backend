import { IsString, MinLength } from 'class-validator';

export class CreateMessageCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description: string;
}
