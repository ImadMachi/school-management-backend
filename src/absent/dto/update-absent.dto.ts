import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}
export class UpdateAbsentDto {

  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  day: string;

  @IsArray()
  @IsNotEmpty()
  hours: string[];

  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsBoolean()
  justified: boolean;

  @ValidateNested({ each: true })
  @Type(() => Id)
  absentUser: Id;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Id)
  replaceUser: Id[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Id)
  classes: Id[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Id)
  subjects: Id[];

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  status: string;

}