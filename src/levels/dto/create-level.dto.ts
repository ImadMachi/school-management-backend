import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class CreateLevelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Id)
  cycle: Id;
}
