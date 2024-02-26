import { Request, Response, NextFunction } from "express";
import { checkAccessToken } from "../../presentation/middlewares/authMiddleware";
import userService from "../../application/user.service";
import {cognitoVerifier} from "../../config/cognitoVerifier";

jest.mock("../../application/user.service");
jest.mock("../../config/cognitoVerifier");

describe("checkAccessToken Middleware", () => {
  let req: any // Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer mockAccessToken",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should pass with valid access token", async () => {
    const mockDecodedToken = { sub: "mockCognitoUserId" };
    (cognitoVerifier.verify as jest.Mock).mockResolvedValue(mockDecodedToken);

    const mockUser = { id: 1, cognitoSub: "mockCognitoUserId" };
    (userService.findUserByCognitoSub as jest.Mock).mockResolvedValue(mockUser);

    await checkAccessToken(req as Request, res as Response, next);

    expect(userService.findUserByCognitoSub).toHaveBeenCalledWith(
      "mockCognitoUserId"
    );
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  it("should handle missing or invalid access token", async () => {
    delete req.headers.authorization;

    await checkAccessToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access token is missing or invalid",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle invalid access token", async () => {
    (cognitoVerifier.verify as jest.Mock).mockRejectedValue(
      new Error("Invalid token")
    );

    await checkAccessToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid access token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle missing user in the database", async () => {
    const mockDecodedToken = { sub: "mockCognitoUserId" };
    (cognitoVerifier.verify as jest.Mock).mockResolvedValue(mockDecodedToken);

    (userService.findUserByCognitoSub as jest.Mock).mockResolvedValue(null);

    await checkAccessToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid access token",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
