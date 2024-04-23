import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class CreateCycleDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
