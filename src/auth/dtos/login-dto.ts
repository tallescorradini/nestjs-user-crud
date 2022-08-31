import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(3, 16)
  readonly password: string;
}
