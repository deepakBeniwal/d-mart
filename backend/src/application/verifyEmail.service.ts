import { emailConfig } from "../config/EmailServiceConfig";

export const verifyUserEmail = async (email: string): Promise<void> => {
  const params = {
    EmailAddress: email,
  };

  try {
    // Initiate the email verification process
    await emailConfig.verifyEmailIdentity(params).promise();
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error verifying email address ${email}:`, error);
    throw new Error(`Error verifying email address ${email}`);
  }
};
