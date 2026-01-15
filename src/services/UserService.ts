import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserDTO, UpdateUserDTO } from '../models';
import { dataStore } from '../data/store';

export class UserService {
  getAllUsers(): User[] {
    return dataStore.getUsers();
  }

  getUserById(id: string): User | null {
    return dataStore.getUserById(id) || null;
  }

  getUserByEmail(email: string): User | null {
    return dataStore.getUserByEmail(email) || null;
  }

  createUser(dto: CreateUserDTO): User {
    const existingUser = dataStore.getUserByEmail(dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user: User = {
      id: uuidv4(),
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      handicap: dto.handicap,
      membershipType: dto.membershipType || 'guest',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dataStore.saveUser(user);
    return user;
  }

  updateUser(id: string, dto: UpdateUserDTO): User | null {
    const user = dataStore.getUserById(id);
    if (!user) {
      return null;
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = dataStore.getUserByEmail(dto.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    const updatedUser: User = {
      ...user,
      ...dto,
      updatedAt: new Date(),
    };

    dataStore.saveUser(updatedUser);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    return dataStore.deleteUser(id);
  }
}

export const userService = new UserService();
