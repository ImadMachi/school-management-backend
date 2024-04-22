import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class UpdateTemplateDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  body: string;

  @ValidateNested()
  @Type(() => Id)
  category: Id;
}
