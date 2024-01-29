import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateTeacherDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    dateOfBirth: Date;

    @IsNotEmpty()
    dateOfEmployment: Date;

    @IsNotEmpty()
    sex: string;

    // @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    createUserDto: CreateUserDto;
}

