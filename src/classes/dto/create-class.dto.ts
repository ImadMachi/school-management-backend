import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Id)
  teachers: Id[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Id)
  students: Id[];

  @IsObject()
  @ValidateNested()
  @Type(() => Id)
  administrator: Id;
}
