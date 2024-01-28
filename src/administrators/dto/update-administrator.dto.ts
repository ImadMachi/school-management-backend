import { PartialType } from '@nestjs/mapped-types';
import { CreateAdministratorDto } from './create-administrator.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAdministratorDto extends PartialType(CreateAdministratorDto) {
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
