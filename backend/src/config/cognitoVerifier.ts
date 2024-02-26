import { CognitoJwtVerifier } from "aws-jwt-verify";

const cognitoVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export { cognitoVerifier } 