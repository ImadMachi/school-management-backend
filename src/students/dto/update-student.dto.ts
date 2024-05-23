import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class Id {
    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    id: number;
  }
  

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
    @IsOptional()
    @IsNotEmpty()
    firstName: string;

    @IsOptional()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsNotEmpty()   
    identification: string;

    @IsOptional()
    @IsNotEmpty()
    dateOfBirth: Date;

    @IsOptional()
    @IsNotEmpty()
    sex: string;
      
    @IsObject()
    @ValidateNested()
    @Type(() => Id)
    father: Id;

    @IsObject()
    @ValidateNested()
    @Type(() => Id)
    mother: Id;
}
