import { Type } from 'class-transformer';
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
  @IsString()
  id: string;
}
