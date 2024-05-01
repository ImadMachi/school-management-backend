import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

class SessionDto {
  @IsOptional()
  @IsObject()
  user: Id;
}

class AbsennceDayDto {
  @IsString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SessionDto)
  sessions: SessionDto[];
}

export class UpdateAbsenceDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  reason: string;

  @IsBoolean()
  @IsOptional()
  justified: boolean;

  @IsObject()
  absentUser: Id;

  @IsString()
  status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AbsennceDayDto)
  absenceDays: AbsennceDayDto[];
}
