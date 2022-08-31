import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: '5b4b903a-a70d-42b4-aeb9-8421b03231c0',
      name: 'Test user 1',
      email: 'test1@test.com',
      password: '$2b$10$dT59aOcrm/8x.we0Um5Ude8AD1ikDUFZkllBNl47a17k3SUM0MWRm',
    },
    {
      id: 'c02191f0-4b78-40c2-abfd-1a89695080eb',
      name: 'Test user 2',
      email: 'test2@test.com',
      password: '$2b$10$6N/guUU53QcPz5Zjkmxe5e8DIaA9RS27KGaUa/bkwGEWaAER8SrnO',
    },
  ];
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
  getUserCredentials(email: string): User {
    const user = this.users.filter((user) => user.email === email)[0] || null;

    if (!user) throw new NotFoundException();
    return user;
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
