import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class CreateAbsenceDto {
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  reason: string;

  @IsObject()
  @ValidateNested()
  absentUser: Id;

  // @IsArray()
  // @IsObject({ each: true })
  // @ValidateNested({ each: true })
  // replacingUsers: Id[];
}
