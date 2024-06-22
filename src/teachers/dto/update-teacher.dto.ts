import { IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class Id {
    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    id: number;
}

export class UpdateTeacherDto {
    @IsOptional()
    @IsNotEmpty()
    firstName: string;

    @IsOptional()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsNotEmpty()
    phoneNumber: string;

    @IsOptional()
    @IsNotEmpty()
    dateOfBirth: Date;

    @IsOptional()
    @IsNotEmpty()
    dateOfEmployment: Date;

    @IsOptional()
    @IsNotEmpty()
    sex: string;

    @IsOptional()
    @IsNotEmpty()
    subjects: string;


//     @IsArray()
//     @ValidateNested()
//     @Type(() => Id)
//     subjects: Id[];
}
