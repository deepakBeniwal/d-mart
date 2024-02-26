import { UserRepository } from '../domain/Repository/UserRepositry';
import { User } from '../domain/entities/User';
import * as userQueries from "../infrastructure/userQueries";

export class UserService implements UserRepository {
  async createUser(
    email: string,
    name: string,
    phone_number: string,
    address: string,
    gender: string,
    cognitoSub: string
  ): Promise<User> {
    try {
      const newUser = await userQueries.createUserInPrisma(
        email,
        name,
        phone_number,
        address,
        gender,
        cognitoSub
      );
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user.");
    }
  }

  async getUserById(userId: number): Promise<User | undefined> {
    try {
      const user = await userQueries.getUserFromPrisma(userId);
      return user ?? undefined;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw new Error("Failed to get user by ID.");
    }
  }

  async getUserByCognitoSub(cognitoSub: string): Promise<User | undefined> {
    try {
      const user = await userQueries.getUserByCognitoSubFromPrisma(cognitoSub);
      return user ?? undefined;
    } catch (error) {
      console.error("Error getting user by Cognito Sub:", error);
      throw new Error("Failed to get user by Cognito Sub.");
    }
  }

  async updateUser(
    userId: number,
    name: string,
    phone_number: string,
    address: string,
    gender: string
  ): Promise<User> {
    try {
      const updatedUser = await userQueries.updateUserInPrisma(
        userId,
        name,
        phone_number,
        address,
        gender
      );
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user.");
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await userQueries.deleteUserFromPrisma(userId);
      console.log("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user.");
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await userQueries.getUserByEmailFromPrisma(email);
      return user ?? undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new Error("Failed to get user by email.");
    }
  }

  async findUserByCognitoSub(cognitoSub: string): Promise<User | undefined> {
    try {
      const user = await userQueries.findUserByCognitoSub(cognitoSub);
      return user ?? undefined;
    } catch (error) {
      console.error("Error finding user by Cognito Sub:", error);
      throw new Error("Failed to find user by Cognito Sub.");
    }
  }
}

const userService = new UserService();
export default userService;
