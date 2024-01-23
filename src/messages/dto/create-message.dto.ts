import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  body: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Recipient)
  recipients: Recipient[];
}

class Recipient {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}
