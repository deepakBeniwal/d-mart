import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import dotenv from "dotenv";


dotenv.config();

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: fromIni(),
});


const clientId = process.env.COGNITO_CLIENT_ID ;
const userPoolId = process.env.USER_POOL_ID;

export const signUp = async (
  email: string,
  password: string,
  name: string,
  phone_number: string,
  address: string,
  gender: string
): Promise<string> => {
  try {
    const signUpResponse = await cognito.send(
      new SignUpCommand({
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
          { Name: "phone_number", Value: phone_number },
          { Name: "address", Value: address },
          { Name: "gender", Value: gender },
        ],
      })
    );

    // Extract and return the Cognito User Sub ID
    return signUpResponse.UserSub ?? "";
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update the return type to indicate the authentication result
export const authenticate = async (username: string, password: string) => {
  try {
    console.log(clientId , "clientId")
    // Send authentication request to Cognito
    const authResult = await cognito.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      })
    );

    if (authResult.AuthenticationResult) {
      const { IdToken, AccessToken, RefreshToken } =
        authResult.AuthenticationResult;
      return {
        idToken: IdToken!,
        accessToken: AccessToken!,
        refreshToken: RefreshToken!,
      };
    } else {
      console.error("Authentication failed:", authResult); // Log the authResult for debugging
    }
  } catch (error) {
    console.error(error);
  }
};

export const confirmSignUp = async (
  username: string,
  confirmationCode: string
): Promise<void> => {
  await cognito.send(
    new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
    })
  );
};
