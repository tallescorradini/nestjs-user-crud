import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login-dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser({ email, password }: LoginDto) {
    const { password: encryptedPassword, ...userData } =
      this.usersService.getUserCredentials(email);

    const isValid = await bcrypt.compare(password, encryptedPassword);

    if (!isValid) return null;

    return userData;
  }
}
