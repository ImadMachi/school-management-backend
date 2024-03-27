import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, MinLength, ValidateNested } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  administratorUsers: User[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  users: User[];
}

class User {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}
