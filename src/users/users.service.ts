import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private queryUserById(id: string) {
    const user = this.users.filter((user) => user.id === id)[0];
    if (!user) return null;

    return { id, name: user.name, email: user.email };
  }
  private queryUsers() {
    return this.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
  private async createUser(createUserDto: CreateUserDto) {
    const { password, ...createUserData } = createUserDto;

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const user = { id: uuidv4(), ...createUserData, password: hash };
    this.users.push(user);

    return { id: user.id, name: user.name, email: user.email };
  }
  private updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.filter((user) => user.id === id)[0];
    const updatedUser = { ...user, ...updateUserDto };

    if (!user) throw new NotFoundException();
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex] = updatedUser;

    return { id: user.id, name: user.name, email: user.email };
  }
  private removeUser(id: string) {
    const user = this.users.filter((user) => user.id === id)[0];

    if (!user) throw new NotFoundException();
    const userIndex = this.users.findIndex((user) => user.id === id);
    this.users.splice(userIndex, 1);

    return { id: user.id, name: user.name, email: user.email };
  }

  create(createUserDto: CreateUserDto) {
    return this.createUser(createUserDto);
  }

  findOne(id: string): Omit<User, 'password'> {
    // implement exception if user not found
    return this.queryUserById(id);
  }

  findAll(): Omit<User, 'password'>[] {
    return this.queryUsers();
  }

  update(id: string, updateUserDto: UpdateUserDto): Omit<User, 'password'> {
    return this.updateUser(id, updateUserDto);
  }

  remove(id: string): Omit<User, 'password'> {
    return this.removeUser(id);
  }
}
