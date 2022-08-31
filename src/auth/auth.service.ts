import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const { password: encryptedPassword, ...userData } =
      this.usersService.getUserCredentials(email);

    const isValid = await bcrypt.compare(password, encryptedPassword);

    if (!isValid) return null;

    return userData;
  }

  async login(user: { email: string; id: string }) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
