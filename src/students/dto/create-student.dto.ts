import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

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

    // @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    createUserDto: CreateUserDto;
}
