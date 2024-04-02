import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}
export class CreateAbsentDto {
  @IsNotEmpty()
  @IsString()
  day: string;

  @IsNotEmpty()
  @IsArray()
  hours: string;

  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsBoolean()
  justified: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Id)
  absentUser: Id;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Id)
  replaceUser: Id[];

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  status: string;
}
