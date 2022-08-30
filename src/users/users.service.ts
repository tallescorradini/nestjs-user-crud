import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const { password, ...createUserData } = createUserDto;

    //hashing password
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const user = { id: uuidv4(), ...createUserData, password: hash };
    this.users.push(user);

    return { id: user.id, ...createUserData };
  }

  findOne(id: string): User {
    // implement exception if user not found
    return this.users.filter((user) => user.id === id)[0];
  }

  findAll(): User[] {
    return this.users;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.filter((user) => user.id === id)[0];
    const updatedUser = { ...user, ...updateUserDto };

    if (!user) throw new NotFoundException();
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  remove(id: string): User {
    const user = this.users.filter((user) => user.id === id)[0];

    if (!user) throw new NotFoundException();
    const userIndex = this.users.findIndex((user) => user.id === id);
    this.users.splice(userIndex, 1);

    return user;
  }
}
