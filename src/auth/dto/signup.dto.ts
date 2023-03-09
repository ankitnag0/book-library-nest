import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../enum';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsEnum(Role)
  @IsOptional()
  roles: Role;
}
