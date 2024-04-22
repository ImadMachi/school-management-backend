import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class CreateTemplateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  body: string;

  @ValidateNested({ each: true })
  @Type(() => Id)
  category: Id;
}
