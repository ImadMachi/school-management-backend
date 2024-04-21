import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

class Id {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

export class CreateStudentDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  identification: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNotEmpty()
  sex: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Id)
  parent: Id;
  // @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  createUserDto: CreateUserDto;
}
