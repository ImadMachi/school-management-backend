import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

class Id {
    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    id: number;
}

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

    @IsNotEmpty()
    subjects: string;

    // @IsArray()
    // @ValidateNested()
    // @Type(() => Id)
    // subjects: Id[];

    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    createUserDto: CreateUserDto;
}
