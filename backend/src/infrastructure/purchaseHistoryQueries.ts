// purchaseHistoryQueries.ts

import prisma from "../presentation/utils/prisma/client";
import { PurchaseHistory } from "../domain/entities/Order";

export const getPurchaseHistory = async (
  userId: number
): Promise<PurchaseHistory[]> => {
  return await prisma.userPurchaseHistory.findMany({
    where: {
      userId: userId,
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Assuming you want to order by creation date
    },
  });
};

export const getPurchaseById = async (
  id: number
): Promise<PurchaseHistory | null> => {
  return await prisma.userPurchaseHistory.findUnique({
    where: {
      id: id,
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
};
