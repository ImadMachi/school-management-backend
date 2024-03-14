import { IsNotEmpty } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  category: number;
}
