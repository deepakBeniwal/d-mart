import {
    signUp,
    authenticate,
    confirmSignUp,
  } from "../../application/cognito.service";
  import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    ConfirmSignUpCommand,
  } from "@aws-sdk/client-cognito-identity-provider";
  
  // Mocking CognitoIdentityProviderClient
  jest.mock("@aws-sdk/client-cognito-identity-provider", () => {
    return {
      CognitoIdentityProviderClient: jest.fn(() => ({
        send: jest.fn(),
      })),
      SignUpCommand: jest.fn(),
      InitiateAuthCommand: jest.fn(),
      ConfirmSignUpCommand: jest.fn(),
    };
  });
  
  describe("Authentication Service", () => {
    describe("signUp", () => {
      it("should sign up a user", async () => {
        // Mocking successful sign-up response
        (CognitoIdentityProviderClient as jest.Mock).mockImplementation(() => ({
          send: jest.fn().mockResolvedValue({ UserSub: 2222 }),
        }));
  
        const email = "test@example.com";
        const password = "password";
        const name = "Test User";
        const phone_number = "1234567890";
        const address = "123 Test Street";
        const gender = "male";
  
        const userSubId = await signUp(email, password, name, phone_number, address, gender);
  
        expect(userSubId).toBe(2222);
      });
  
      it("should throw an error on sign up failure", async () => {
        // Mocking sign-up failure
        (CognitoIdentityProviderClient as jest.Mock).mockImplementation(() => ({
          send: jest.fn().mockRejectedValue(new Error("Failed to sign up")),
        }));
  
        const email = "test@example.com";
        const password = "password";
        const name = "Test User";
        const phone_number = "1234567890";
        const address = "123 Test Street";
        const gender = "male";
  
        await expect(
          signUp(email, password, name, phone_number, address, gender)
        ).rejects.toThrow("Failed to sign up");
      });
    });
  
    describe("authenticate", () => {
      it("should authenticate a user", async () => {
        // Mocking successful authentication response
        (CognitoIdentityProviderClient as jest.Mock).mockImplementation(() => ({
          send: jest.fn().mockResolvedValue({
            AuthenticationResult: {
              IdToken: "id-token",
              AccessToken: "access-token",
              RefreshToken: "refresh-token",
            },
          }),
        }));
  
        const username = "test@example.com";
        const password = "password";
  
        const authResult = await authenticate(username, password);
  
        expect(authResult).toEqual({
          idToken: "id-token",
          accessToken: "access-token",
          refreshToken: "refresh-token",
        });
      });
  
      it("should handle authentication failure", async () => {
        // Mocking authentication failure
        (CognitoIdentityProviderClient as jest.Mock).mockImplementation(() => ({
          send: jest.fn().mockResolvedValue({}), // Empty response indicates authentication failure
        }));
  
        const username = "test@example.com";
        const password = "password";
  
        const authResult = await authenticate(username, password);
  
        expect(authResult).toBeUndefined();
      });
    });
  
    describe("confirmSignUp", () => {
      it("should confirm sign-up for a user", async () => {
        // Mocking successful sign-up confirmation
        (CognitoIdentityProviderClient as jest.Mock).mockImplementation(() => ({
          send: jest.fn().mockResolvedValue({}),
        }));
  
        const username = "test@example.com";
        const confirmationCode = "123456";
  
        await confirmSignUp(username, confirmationCode);
  
        expect(ConfirmSignUpCommand).toHaveBeenCalledWith({
          ClientId: expect.any(String),
          Username: username,
          ConfirmationCode: confirmationCode,
        });
      });
  
      it("should throw an error on sign-up confirmation failure", async () => {
        // Mocking sign-up confirmation failure
        (CognitoIdentityProviderClient as jest.Mock).mockImplementation(() => ({
          send: jest.fn().mockRejectedValue(new Error("Failed to confirm sign-up")),
        }));
  
        const username = "test@example.com";
        const confirmationCode = "123456";
  
        await expect(confirmSignUp(username, confirmationCode)).rejects.toThrow(
          "Failed to confirm sign-up"
        );
      });
    });
  });
  