import prisma from "../presentation/utils/prisma/client";

export const findCartForUser = async (userId: number) => {
  return prisma.cart.findUnique({
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
  });
};

export const createPurchaseHistory = async (
  userId: number,
  totalItems: number,
  totalPrice: number,
  products: any[]
) => {
  return prisma.userPurchaseHistory.create({
    data: {
      userId: userId,
      totalItems: totalItems,
      totalPrice: totalPrice,
      products: {
        createMany: {
          data: products.map((product: any) => ({
            productId: product.productId,
            quantity: product.quantity,
            price: product.product.price,
          })),
        },
      },
    },
    include: {
      products: true,
    },
  });
};

export const updatePurchaseHistory = async (
  purchaseHistoryId: number,
  products: any[]
) => {
  for (const productInCart of products) {
    await prisma.userProductInPurchaseHistory.upsert({
      where: {
        productId_purchaseHistoryId: {
          productId: productInCart.productId,
          purchaseHistoryId: purchaseHistoryId,
        },
      },
      update: {
        quantity: productInCart.quantity,
        price: productInCart.product.price,
      },
      create: {
        productId: productInCart.productId,
        quantity: productInCart.quantity,
        price: productInCart.product.price,
        purchaseHistoryId: purchaseHistoryId,
      },
    });
  }
};

export const clearCartItems = async (cartId: number) => {
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cartId,
    },
  });
};

export const deleteShoppingCart = async (userId: number) => {
  await prisma.cart.delete({
    where: {
      userId: userId,
    },
  });
};
