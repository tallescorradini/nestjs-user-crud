import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const { password: encryptedPassword, ...userData } =
      this.usersService.getUserCredentials(email);

    const isValid = await bcrypt.compare(password, encryptedPassword);

    if (!isValid) return null;

    return userData;
  }
}
