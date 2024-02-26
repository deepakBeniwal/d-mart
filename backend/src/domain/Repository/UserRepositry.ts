// src/domain/UserRepository.ts

import { User } from '../entities/User';

export interface UserRepository {
  createUser(
    email: string,
    name: string,
    phone_number: string,
    address: string,
    gender: string,
    cognitoSub: string
  ): Promise<User>;

  getUserById(userId: number): Promise<User | undefined>;

  getUserByCognitoSub(cognitoSub: string): Promise<User | undefined>;

  updateUser(
    userId: number,
    name: string,
    phone_number: string,
    address: string,
    gender: string
  ): Promise<User>;

  deleteUser(userId: number): Promise<void>;

  getUserByEmail(email: string): Promise<User | undefined>;

  findUserByCognitoSub(cognitoSub: string): Promise<User | undefined>;
}
