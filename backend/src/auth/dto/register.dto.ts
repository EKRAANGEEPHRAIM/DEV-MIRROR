import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email' })
  email!: string;

  @IsString()
  @MinLength(3, { message: 'Username minimum 3 characters' })
  username!: string;

  @IsString()
  @MinLength(6, { message: 'Password minimum 6 characters' })
  password!: string;

  @IsString()
  @IsOptional()
  fullName?: string;
}
