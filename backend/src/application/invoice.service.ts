import { emailConfig } from "../config/EmailServiceConfig";
import { generatePurchaseHistoryEmailTemplate } from "../presentation/utils/purchaseHistoryEmailTemplate";

export const sendPurchaseHistoryEmail = async (
  recipientEmail: string,
  purchaseHistory: any
): Promise<void> => {
  const subject = "Purchase History Details";
  const message = generatePurchaseHistoryEmailTemplate(purchaseHistory);

  const params = {
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: process.env.SOURCE_EMAIL ?? "beniwald33@gmail.com",
  };

  try {
    await emailConfig.sendEmail(params).promise();
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
