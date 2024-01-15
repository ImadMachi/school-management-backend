import { IsNotEmpty } from 'class-validator';

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
    m
    @IsNotEmpty()
    sex : string;
}

