import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsNotEmpty()
  schoolYear: string;

  @IsArray()
  @ValidateNested({ each: true })
  classes: Id[];
}
