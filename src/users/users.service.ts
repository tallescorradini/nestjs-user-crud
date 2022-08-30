import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const user = { id: '1', ...createUserDto };
    this.users.push(user);

    return user;
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
