// update-teacher.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
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
}
