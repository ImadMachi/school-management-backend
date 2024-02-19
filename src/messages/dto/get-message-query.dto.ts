import { IsIn, IsOptional, IsString } from 'class-validator';
import { MailFolder } from '../enums/mail-folder.enum';

export class GetMessageQueryDto {
  @IsIn(Object.values(MailFolder))
  folder;

  @IsString()
  @IsOptional()
  timestamp: string;
}
