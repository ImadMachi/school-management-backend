import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class CreateLevelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  schoolYear: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Id)
  classes: Id[];
}
