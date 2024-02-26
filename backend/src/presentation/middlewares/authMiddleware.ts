import { Request, Response, NextFunction } from "express";
import { cognitoVerifier } from "../../config/cognitoVerifier";
import  userService  from "../../application/user.service";

import {User} from "../typings/middleware.interfaces"

export const checkAccessToken = async (
  req: Request & { user?: User }, 
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  // Remove the "Bearer " prefix from the token
  const accessToken = authorizationHeader.slice("Bearer ".length);

  try {
    // Verify the access token
    const decodedToken = await cognitoVerifier.verify(accessToken);

    const cognitoUserId = decodedToken?.sub;

    if (!cognitoUserId) {
      throw new Error("User ID not found in the access token");
    }

    // Check the user table for the actual user ID based on the Cognito user ID
    const user = await 
    userService.findUserByCognitoSub(cognitoUserId);

    if (!user) {
      throw new Error("User not found in the database");
    }

    // Embed the whole user in the req object
    req.user = user;

    next();
  } catch (error) {
    console.log("Token not valid!", error);
    return res.status(401).json({ message: "Invalid access token" });
  }
};
