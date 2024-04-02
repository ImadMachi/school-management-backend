import { PartialType } from '@nestjs/mapped-types';
import { CreateAgentDto } from './create-agent.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAgentDto extends PartialType(CreateAgentDto) {
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
