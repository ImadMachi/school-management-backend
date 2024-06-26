import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class UpdateCycleDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
