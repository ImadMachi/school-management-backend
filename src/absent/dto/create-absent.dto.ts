import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class CreateAbsentDto {
  @IsNotEmpty()
  @Type(() => Date)
  datedebut: Date;

  @IsNotEmpty()
  @Type(() => Date)
  datefin: Date;

  @IsNotEmpty()
  reason: string;

  @IsNotEmpty()
  justified: boolean;

  @IsObject()
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
