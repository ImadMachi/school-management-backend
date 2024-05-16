import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

class Recipient {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class ForwardMessageDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Recipient)
  recipients: Recipient[];
}
