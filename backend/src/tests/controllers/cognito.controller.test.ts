import {
    registerUser,
    deleteUserAccount,
    loginUser,
    confirmUser,
    getUserDetailsByCognitoSub,
  } from "../../presentation/controllers/cognito.controller";
  import { Request, Response } from "express";
  import { signUp, authenticate, confirmSignUp } from "../../application/cognito.service";
  import userService from "../../application/user.service";
  import { verifyUserEmail } from "../../application/verifyEmail.service";
  
  jest.mock("../../application/cognito.service");
  jest.mock("../../application/user.service");
  jest.mock("../../application/verifyEmail.service");
  
  describe("UserController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
  
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    describe("registerUser", () => {
      it("should register a new user", async () => {
        req.body = {
          email: "test@example.com",
          password: "password123",
          name: "Test User",
          phone_number: "1234567890",
          address: "123 Street, City",
          gender: "Male",
        };
        (signUp as jest.Mock).mockResolvedValue("cognito-sub-123");
        (verifyUserEmail as jest.Mock).mockResolvedValue(undefined);
        (userService.createUser as jest.Mock).mockResolvedValue({ id: 1, email: "test@example.com" });
  
        await registerUser(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: "User registration successful",
          user: { id: 1, email: "test@example.com" },
        });
      });
  
      it("should handle errors during user registration", async () => {
        req.body = {
          email: "test@example.com",
          password: "password123",
          name: "Test User",
          phone_number: "1234567890",
          address: "123 Street, City",
          gender: "Male",
        };
        (signUp as jest.Mock).mockRejectedValue(new Error("Failed to sign up user"));
  
        await registerUser(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error registering user" });
      });
    });
  
    describe("deleteUserAccount", () => {
      it("should delete a user account", async () => {
        req.body = { email: "test@example.com" };
        (userService.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });
        (userService.deleteUser as jest.Mock).mockResolvedValue(undefined);
  
        await deleteUserAccount(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
      });
  
      it("should handle user not found during deletion", async () => {
        req.body = { email: "nonexistent@example.com" };
        (userService.getUserByEmail as jest.Mock).mockResolvedValue(undefined);
  
        await deleteUserAccount(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      });
  
      it("should handle errors during user deletion", async () => {
        req.body = { email: "test@example.com" };
        (userService.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });
        (userService.deleteUser as jest.Mock).mockRejectedValue(new Error("Failed to delete user"));
  
        await deleteUserAccount(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error deleting user" });
      });
    });
  
    describe("loginUser", () => {
      it("should log in a user", async () => {
        req.body = { username: "test@example.com", password: "password123" };
        (authenticate as jest.Mock).mockResolvedValue({ idToken: "token123" });
  
        await loginUser(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "User login successful",
          authTokens: { idToken: "token123" },
        });
      });
  
      it("should handle authentication failure during login", async () => {
        req.body = { username: "test@example.com", password: "wrongpassword" };
        (authenticate as jest.Mock).mockResolvedValue(null);
  
        await loginUser(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Authentication failed" });
      });
  
      it("should handle errors during user login", async () => {
        req.body = { username: "test@example.com", password: "password123" };
        (authenticate as jest.Mock).mockRejectedValue(new Error("Authentication failed"));
  
        await loginUser(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Authentication failed" });
      });
    });
  
    describe("confirmUser", () => {
      it("should confirm a user", async () => {
        req.body = { username: "test@example.com", confirmationCode: "123456" };
        (confirmSignUp as jest.Mock).mockResolvedValue(undefined);
  
        await confirmUser(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User confirmed successfully" });
      });
  
      it("should handle errors during user confirmation", async () => {
        req.body = { username: "test@example.com", confirmationCode: "123456" };
        (confirmSignUp as jest.Mock).mockRejectedValue(new Error("Failed to confirm user"));
  
        await confirmUser(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error confirming user" });
      });
    });
  
    describe("getUserDetailsByCognitoSub", () => {
      it("should get user details by Cognito Sub", async () => {
        req.params = { cognitoSub: "cognito-sub-123" };
        (userService.getUserByCognitoSub as jest.Mock).mockResolvedValue({ id: 1, email: "test@example.com" });
  
        await getUserDetailsByCognitoSub(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: "User details fetched successfully",
          user: { id: 1, email: "test@example.com" },
        });
      });
  
      it("should handle user not found by Cognito Sub", async () => {
        req.params = { cognitoSub: "nonexistent-sub" };
        (userService.getUserByCognitoSub as jest.Mock).mockResolvedValue(undefined);
  
        await getUserDetailsByCognitoSub(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      });
  
      it("should handle errors during fetching user details by Cognito Sub", async () => {
        req.params = { cognitoSub: "invalid-sub" };
        (userService.getUserByCognitoSub as jest.Mock).mockRejectedValue(new Error("Failed to fetch user details"));
  
        await getUserDetailsByCognitoSub(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error fetching user details" });
      });
    });
  });
  