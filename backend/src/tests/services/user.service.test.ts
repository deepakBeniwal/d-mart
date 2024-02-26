import { UserService } from "../../application/user.service";
import * as userQueries from "../../infrastructure/userQueries";

jest.mock("../../infrastructure/userQueries");

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      const mockUser = { id: 1, email: "test@example.com" };

      (userQueries.createUserInPrisma as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser(
        "test@example.com",
        "Test User",
        "1234567890",
        "Test Address",
        "Male",
        "cognito-sub-123"
      );

      expect(result).toEqual(mockUser);
      expect(userQueries.createUserInPrisma).toHaveBeenCalledWith(
        "test@example.com",
        "Test User",
        "1234567890",
        "Test Address",
        "Male",
        "cognito-sub-123"
      );
    });

    it("should throw an error if failed to create user", async () => {
      (userQueries.createUserInPrisma as jest.Mock).mockRejectedValue(new Error("Failed to create user."));

      await expect(userService.createUser(
        "test@example.com",
        "Test User",
        "1234567890",
        "Test Address",
        "Male",
        "cognito-sub-123"
      )).rejects.toThrow("Failed to create user.");
    });
  });

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const mockUser = { id: 1, email: "test@example.com" };

      (userQueries.getUserFromPrisma as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(userQueries.getUserFromPrisma).toHaveBeenCalledWith(1);
    });

    it("should return undefined if user with ID not found", async () => {
      (userQueries.getUserFromPrisma as jest.Mock).mockResolvedValue(undefined);

      const result = await userService.getUserById(999);

      expect(result).toBeUndefined();
    });

    it("should throw an error if failed to get user by ID", async () => {
      (userQueries.getUserFromPrisma as jest.Mock).mockRejectedValue(new Error("Failed to get user."));

      await expect(userService.getUserById(1)).rejects.toThrow("Failed to get user by ID.");
    });
  });

  describe("getUserByCognitoSub", () => {
    it("should return a user by Cognito Sub", async () => {
      const mockUser = { id: 1, email: "test@example.com" };

      (userQueries.getUserByCognitoSubFromPrisma as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserByCognitoSub("cognito-sub-123");

      expect(result).toEqual(mockUser);
      expect(userQueries.getUserByCognitoSubFromPrisma).toHaveBeenCalledWith("cognito-sub-123");
    });

    it("should return undefined if user with Cognito Sub not found", async () => {
      (userQueries.getUserByCognitoSubFromPrisma as jest.Mock).mockResolvedValue(undefined);

      const result = await userService.getUserByCognitoSub("nonexistent-sub");

      expect(result).toBeUndefined();
    });

    it("should throw an error if failed to get user by Cognito Sub", async () => {
      (userQueries.getUserByCognitoSubFromPrisma as jest.Mock).mockRejectedValue(new Error("Failed to get user by Cognito Sub."));

      await expect(userService.getUserByCognitoSub("invalid-sub")).rejects.toThrow("Failed to get user by Cognito Sub.");
    });
  });

  describe("updateUser", () => {
    it("should update a user successfully", async () => {
      const mockUser = { id: 1, name: "Updated Name" };

      (userQueries.updateUserInPrisma as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.updateUser(1, "Updated Name", "1234567890", "Updated Address", "Female");

      expect(result).toEqual(mockUser);
      expect(userQueries.updateUserInPrisma).toHaveBeenCalledWith(1, "Updated Name", "1234567890", "Updated Address", "Female");
    });

    it("should throw an error if failed to update user", async () => {
      (userQueries.updateUserInPrisma as jest.Mock).mockRejectedValue(new Error("Failed to update user."));

      await expect(userService.updateUser(1, "Updated Name", "1234567890", "Updated Address", "Female")).rejects.toThrow("Failed to update user.");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      (userQueries.deleteUserFromPrisma as jest.Mock).mockResolvedValue(undefined);

      await expect(userService.deleteUser(1)).resolves.toBeUndefined();
      expect(userQueries.deleteUserFromPrisma).toHaveBeenCalledWith(1);
    });

    it("should throw an error if failed to delete user", async () => {
      (userQueries.deleteUserFromPrisma as jest.Mock).mockRejectedValue(new Error("Failed to delete user."));

      await expect(userService.deleteUser(1)).rejects.toThrow("Failed to delete user.");
    });
  });

  describe("getUserByEmail", () => {
    it("should return a user by email", async () => {
      const mockUser = { id: 1, email: "test@example.com" };

      (userQueries.getUserByEmailFromPrisma as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail("test@example.com");

      expect(result).toEqual(mockUser);
      expect(userQueries.getUserByEmailFromPrisma).toHaveBeenCalledWith("test@example.com");
    });

    it("should return undefined if user with email not found", async () => {
      (userQueries.getUserByEmailFromPrisma as jest.Mock).mockResolvedValue(undefined);

      const result = await userService.getUserByEmail("nonexistent@example.com");

      expect(result).toBeUndefined();
    });

    it("should throw an error if failed to get user by email", async () => {
      (userQueries.getUserByEmailFromPrisma as jest.Mock).mockRejectedValue(new Error("Failed to get user by email."));

      await expect(userService.getUserByEmail("invalid@example.com")).rejects.toThrow("Failed to get user by email.");
    });
  });

  describe("findUserByCognitoSub", () => {
    it("should return a user by Cognito Sub", async () => {
      const mockUser = { id: 1, email: "test@example.com" };

      (userQueries.findUserByCognitoSub as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.findUserByCognitoSub("cognito-sub-123");

      expect(result).toEqual(mockUser);
      expect(userQueries.findUserByCognitoSub).toHaveBeenCalledWith("cognito-sub-123");
    });

    it("should return undefined if user with Cognito Sub not found", async () => {
      (userQueries.findUserByCognitoSub as jest.Mock).mockResolvedValue(undefined);

      const result = await userService.findUserByCognitoSub("nonexistent-sub");

      expect(result).toBeUndefined();
    });

    it("should throw an error if failed to find user by Cognito Sub", async () => {
      (userQueries.findUserByCognitoSub as jest.Mock).mockRejectedValue(new Error("Failed to find user by Cognito Sub."));

      await expect(userService.findUserByCognitoSub("invalid-sub")).rejects.toThrow("Failed to find user by Cognito Sub.");
    });
  });

});
