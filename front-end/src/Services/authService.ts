
import axios from "axios";
import { baseURL } from "../config/apiConfig";
import { LoginFormData } from "../interface/LoginUserForm";

export const registerUser = async (formData: any) => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (formData: LoginFormData): Promise<string> => {
  try {
    // Make API request to authenticate user
    const response = await axios.post(`${baseURL}/auth/login`, formData);

    // Extract the access token from the response
    const { accessToken } = response.data.authTokens;

    return accessToken;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw new Error("Invalid username or password. Please try again.");
  }
};

export const confirmUser = async (email: string, confirmationCode: string): Promise<any> => {
  try {
    const response = await axios.post(`${baseURL}/auth/confirm`, {
      username: email,
      confirmationCode,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};