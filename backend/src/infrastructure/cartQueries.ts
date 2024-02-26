import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findCartWithProducts = async (userId: number) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: { products: true },
  });
};

export const createCart = async (userId: number) => {
  return prisma.cart.create({
    data: { userId },
    include: { products: true },
  });
};

export const findCartItemById = async (itemId: number) => {
  return prisma.cartItem.findUnique({
    where: { id: itemId },
  });
};

export const createCartItem = async (
  quantity: number,
  productId: number,
  cartId: number,
  userId: number
) => {
  return prisma.cartItem.create({
    data: {
      quantity,
      productId,
      cartId,
      userId,
    },
  });
};

export const updateCartItemQuantity = async (
  itemId: number,
  quantity: number
) => {
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
};

export const deleteCartItem = async (itemId: number) => {
  return prisma.cartItem.delete({
    where: { id: itemId },
  });
};

export const deleteCartByUserId = async (userId: number) => {
  return prisma.cart.delete({
    where: { userId },
  });
};

export const viewFindCartWithProducts = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: userId,
    },
    include: {
      products: {
        include: {
          product: true, // Include the related product details
        },
      },
    },
  });

  // Check if the cart is undefined or null
  if (!cart) {
    return null;
  }

  // Check if products array is undefined or empty
  if (!cart.products || cart.products.length === 0) {
    return { ...cart, products: [] }; // Return an empty products array
  }

  return cart;
};
