import { PartialType } from '@nestjs/mapped-types';
import { CreateParentDto } from './create-parent.dto';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from "src/users/dto/create-user.dto";


export class UpdateParentDto extends PartialType(CreateParentDto) {
  @IsOptional()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  phoneNumber: string;
}
