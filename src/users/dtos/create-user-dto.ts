import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(3, 16)
  readonly password: string;
}
