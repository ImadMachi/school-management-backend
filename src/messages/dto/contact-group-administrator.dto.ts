import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ContactGroupAdministratorDto {
  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  groupId: number;
}
