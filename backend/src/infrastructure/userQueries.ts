// userQueries.ts

import prisma from "../presentation/utils/prisma/client";

export const createUserInPrisma = async (
  email: string,
  name: string,
  phone_number: string,
  address: string,
  gender: string,
  cognitoSub: string // Add the Cognito User Sub ID parameter
) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone_number,
        address,
        gender,
        cognitoSub, // Save the Cognito User Sub ID
      },
    });

    return newUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserFromPrisma = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserByCognitoSubFromPrisma = async (cognitoSub: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { cognitoSub: cognitoSub },
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserInPrisma = async (
  userId: number,
  name: string,
  phone_number: string,
  address: string,
  gender: string
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone_number,
        address,
        gender,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUserFromPrisma = async (userId: number) => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserByEmailFromPrisma = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findUserByCognitoSub = async (cognitoSub: string) => {
  return await prisma.user.findUnique({
    where: {
      cognitoSub: cognitoSub,
    },
  });
};
