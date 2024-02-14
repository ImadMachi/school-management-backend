import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateParentDto {
    
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;
  
    @IsNotEmpty()
    phoneNumber: string;
  
    // @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    createUserDto: CreateUserDto;
}
