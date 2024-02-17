import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateDirectorDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  createUserDto: CreateUserDto;
}
