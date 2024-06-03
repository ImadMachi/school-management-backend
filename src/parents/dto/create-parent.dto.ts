import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateParentDto {
    
    @IsNotEmpty()
    fatherFirstName: string;

    @IsNotEmpty()
    fatherLastName: string;

    @IsNotEmpty()
    fatherPhoneNumber: string;

    @IsNotEmpty()
    motherFirstName: string;

    @IsNotEmpty()
    motherLastName: string;

    @IsNotEmpty()
    motherPhoneNumber: string;

    @IsNotEmpty()
    address: string;
  
    // @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    createUserDto: CreateUserDto;
}
