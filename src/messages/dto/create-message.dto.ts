import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class Recipient {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

class ParentMessage {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

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

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;

  @ValidateNested({ each: true })
  @Type(() => ParentMessage)
  @IsOptional()
  parentMessage: ParentMessage;
}
