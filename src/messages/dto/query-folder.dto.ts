import { IsIn } from 'class-validator';
import { MailFolder } from '../enums/mail-folder.enum';

export class QueryFolderDto {
  @IsIn(Object.values(MailFolder))
  folder;
}
