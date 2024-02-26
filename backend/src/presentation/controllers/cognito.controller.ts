import { Request, Response } from "express";
import {
  signUp,
  authenticate,
  confirmSignUp,
} from "../../application/cognito.service";
import  userService  from "../../application/user.service";

import { verifyUserEmail } from "../../application/verifyEmail.service";
import { RegisterRequest } from "../typings/cognito.interface";

export const registerUser = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response
): Promise<void> => {
  const { email, password, name, phone_number, address, gender } = req.body;

  try {
    // Sign up with Cognito and get the Cognito User Sub ID
    const cognitoSub = await signUp(
      email,
      password,
      name,
      phone_number,
      address,
      gender
    );

    // sending the mail to confirm the user for invoice
    await verifyUserEmail(email);

    // Save user using userService
    const newUser = await userService.createUser(
      email,
      name,
      phone_number,
      address,
      gender,
      cognitoSub
    );

    res.status(201).json({
      message: "User registration successful",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const deleteUserAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    // Get user using userService
    const user = await userService.getUserByEmail(email);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Delete user using userService
    await userService.deleteUser(user.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Authenticate with Cognito and get tokens
    const authTokens = await authenticate(username, password);

    if (!authTokens) {
      // Authentication failed
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    res.status(200).json({
      message: "User login successful",
      authTokens,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error });
  }
};

export const confirmUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, confirmationCode } = req.body;

  try {
    // Confirm user with Cognito
    await confirmSignUp(username, confirmationCode);

    res.status(200).json({ message: "User confirmed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error confirming user" });
  }
};

export const getUserDetailsByCognitoSub = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cognitoSub } = req.params;

  try {
    // Get user using userService
    const user = await userService.getUserByCognitoSub(cognitoSub);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User details fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user details" });
  }
};
