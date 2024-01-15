import { IsNotEmpty } from 'class-validator';

export class CreateAdministratorDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  phoneNumber: string;
}
