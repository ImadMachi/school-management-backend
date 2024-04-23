import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class UpdateLevelDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Id)
  cycle: Id;
}
