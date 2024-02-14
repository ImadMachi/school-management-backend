import { PartialType } from '@nestjs/mapped-types';
import { CreateParentDto } from './create-parent.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateParentDto extends PartialType(CreateParentDto) {
    @IsOptional()
    @IsNotEmpty()
    firstName: string;

    @IsOptional()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsNotEmpty()
    phoneNumber: string;

}
