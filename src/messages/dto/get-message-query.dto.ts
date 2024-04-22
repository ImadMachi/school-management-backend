import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { MailFolder } from '../enums/mail-folder.enum';
import { Transform } from 'class-transformer';

export class GetMessageQueryDto {
  @IsIn(Object.values(MailFolder))
  folder;

  @IsString()
  @IsOptional()
  timestamp: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  limit: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  offset: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  categoryId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  userId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  groupId: number;

  @IsString()
  @IsOptional()
  text: string;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;
}
