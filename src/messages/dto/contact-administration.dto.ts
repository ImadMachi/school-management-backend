import { IsString } from 'class-validator';

export class ContactAdministrationDto {
  @IsString()
  subject: string;

  @IsString()
  body: string;
}
